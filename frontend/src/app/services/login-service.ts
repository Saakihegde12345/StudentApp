import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { supabase } from './supabase-client.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  login(email: string, password: string): Observable<any> {
    const p = supabase.auth.signInWithPassword({ email, password });
    return from(p);
  }

  signOut(): Observable<any> {
    const p = supabase.auth.signOut();
    return from(p);
  }
}
