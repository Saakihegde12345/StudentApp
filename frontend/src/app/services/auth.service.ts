import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { supabase } from './supabase-client.service';
import type { Provider } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user$ = new BehaviorSubject<any>(null);
  public user$ = this._user$.asObservable();
  private _lastAccessToken: string | null = null;

  constructor() {
    // Listen for auth state changes and keep the latest token in-memory.
    // Avoid calling `getSession()` here to prevent LockManager/storage errors.
    try {
      supabase.auth.onAuthStateChange((_event, session) => {
        try {
          this._user$.next(session?.user ?? null);
          // session may be an object with access_token or contain `data.session`
          // handle both possibilities defensively
          if (session && (session as any).access_token) {
            this._lastAccessToken = (session as any).access_token;
          } else if ((session as any)?.data?.session?.access_token) {
            this._lastAccessToken = (session as any).data.session.access_token;
          } else {
            // clear when user signs out
            if (!session) this._lastAccessToken = null;
          }
        } catch {
          this._user$.next(null);
          this._lastAccessToken = null;
        }
      });
    } catch {
      // ignore subscription errors
    }
  }

  signOut(): Observable<any> {
    return from(supabase.auth.signOut());
  }

  signInWithOAuth(provider: Provider): Observable<any> {
    return from(supabase.auth.signInWithOAuth({ provider }));
  }

  sendMagicLink(email: string): Observable<any> {
    return from(supabase.auth.signInWithOtp({ email }));
  }

  async getAccessToken(): Promise<string | null> {
    // Prefer the in-memory token populated by onAuthStateChange to avoid
    // invoking Supabase storage APIs which may cause LockManager errors.
    if (this._lastAccessToken) return this._lastAccessToken;
    // Fallback: attempt to call getSession but guard against failures.
    try {
      const { data } = await supabase.auth.getSession();
      return data?.session?.access_token ?? null;
    } catch {
      return null;
    }
  }
}
