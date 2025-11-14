import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { supabase } from './supabase-client.service';
import type { Provider } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user$ = new BehaviorSubject<any>(null);
  public user$ = this._user$.asObservable();

  constructor() {
    // initialize current user
    // initialize current user (catch errors so storage/lock failures don't crash)
    supabase.auth.getSession()
      .then(({ data }) => this._user$.next(data?.session?.user ?? null))
      .catch(() => this._user$.next(null));

    // listen for changes — protect the handler against unexpected errors
    try {
      supabase.auth.onAuthStateChange((_event, session) => {
        try {
          this._user$.next(session?.user ?? null);
        } catch {
          this._user$.next(null);
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
    try {
      const { data } = await supabase.auth.getSession();
      return data?.session?.access_token ?? null;
    } catch {
      return null;
    }
  }
}
