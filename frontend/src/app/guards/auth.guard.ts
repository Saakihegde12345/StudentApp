import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
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
    );
  }
}
