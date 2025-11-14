import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  canActivate() {
    const auth = inject(AuthService);
    const router = inject(Router);
    return auth.user$.pipe(
      take(1),
      map(user => {
        if (user) return true;
        return router.parseUrl('/login');
      })
      ,
      // If the user observable errors (e.g. storage/lock issues),
      // return a redirect to the login page instead of throwing.
      catchError(() => of(router.parseUrl('/login')))
    );
  }
}
