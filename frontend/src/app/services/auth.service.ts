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
    supabase.auth.getSession().then(({ data }) => {
      this._user$.next(data?.session?.user ?? null);
    });

    // listen for changes
    supabase.auth.onAuthStateChange((_event, session) => {
      this._user$.next(session?.user ?? null);
    });
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
