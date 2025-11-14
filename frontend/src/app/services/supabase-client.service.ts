import { createClient, SupabaseClient } from '@supabase/supabase-js';

function readMeta(name: string) {
  try {
    return document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') || '';
  } catch {
    return '';
  }
}

const SUPABASE_URL = (window as any).__env?.SUPABASE_URL || readMeta('supabase-url') || '';
const SUPABASE_KEY = (window as any).__env?.SUPABASE_ANON_KEY || readMeta('supabase-key') || '';

function makeStub() {
  const noop = () => Promise.resolve({ data: null, error: null });
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signInWithOAuth: (_: any) => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signInWithOtp: (_: any) => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
    }
  } as unknown as SupabaseClient;
}

let _supabase: SupabaseClient;
// A tiny synchronous storage adapter that uses `localStorage` when available.
// Providing this avoids Supabase attempting to use async storage + Navigator.locks
// in some environments which can throw NavigatorLockAcquireTimeoutError.
const safeStorage = {
  getItem: (key: string) => {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  setItem: (key: string, value: string) => {
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
  },
  removeItem: (key: string) => {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  }
};

if (SUPABASE_URL && SUPABASE_KEY) {
  // Workaround: disable session persistence which uses Navigator LockManager
  // (some browsers/environments throw NavigatorLockAcquireTimeoutError).
  // Also pass a safe synchronous `storage` adapter so the client doesn't
  // attempt async/lock-based storage. If you require persisted sessions,
  // you can remove `persistSession: false` and provide a robust storage.
  _supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    // Disable session persistence and automatic token refresh to avoid
    // Navigator LockManager-related errors in some browsers/environments.
    // We still provide a synchronous storage adapter to be safe.
    auth: { persistSession: false, storage: safeStorage as any, autoRefreshToken: false }
  });
} else {
  // Provide a safe stub so the app doesn't crash at runtime when keys are missing.
  // Developers should add meta tags in `index.html`:
  // <meta name="supabase-url" content="https://xyz.supabase.co">
  // <meta name="supabase-key" content="public-anon-key">
  // Or set `window.__env.SUPABASE_URL` / `SUPABASE_ANON_KEY` before bootstrap.
  // Log a clear warning to help diagnosis.
  // eslint-disable-next-line no-console
  console.warn('Supabase not configured: no SUPABASE_URL or SUPABASE_KEY found. Auth will be disabled.');
  _supabase = makeStub();
}

export const supabase: SupabaseClient = _supabase;
