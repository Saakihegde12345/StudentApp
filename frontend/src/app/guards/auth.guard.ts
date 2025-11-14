import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    return this.auth.user$.pipe(
      take(1),
      map(user => {
        if (user) return true;
        return this.router.parseUrl('/login');
      }),
      // If the user observable errors (e.g. storage/lock issues),
      // return a redirect to the login page instead of throwing.
      catchError(() => of(this.router.parseUrl('/login')))
    );
  }
}
