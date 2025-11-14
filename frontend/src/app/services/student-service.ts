import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Student } from '../models/student.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  // Read runtime env injected by public/env.js (generated at build time)
  private readonly _env = (window as any).__env || {};
  private api = ((this._env.API_BASE_URL || '').replace(/\/$/, '')) + '/api/students';

  private http = inject(HttpClient);
  private auth = inject(AuthService);

  get():Observable<Student[]>{
    return this.http.get<Student[]>(this.api);
  }

  getById(id: string):Observable<Student> {
    return this.http.get<Student>(this.api + '/' + id);
  }

  post(student: Student): Observable<Student> {
    return from(this.auth.getAccessToken()).pipe(
      switchMap(token => {
        const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
        return this.http.post<Student>(this.api, student, { headers } as any).pipe(map((r: any) => r as Student));
      })
    );
  }

  put(id: string, student: Student): Observable<Student> {
    return from(this.auth.getAccessToken()).pipe(
      switchMap(token => {
        const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
        return this.http.put<Student>(this.api + '/' + id, student, { headers } as any).pipe(map((r: any) => r as Student));
      })
    );
  }

  delete(id: string): Observable<Student> {
    return from(this.auth.getAccessToken()).pipe(
      switchMap(token => {
        const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
        return this.http.delete<Student>(this.api + '/' + id, { headers } as any).pipe(map((r: any) => r as Student));
      })
    );
  }
}
