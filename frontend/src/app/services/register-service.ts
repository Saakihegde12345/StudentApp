
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { supabase } from './supabase-client.service';


@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  register(email: string, password: string): Observable<any> {
    const p = supabase.auth.signUp({ email, password });
    return from(p);
  }
}
