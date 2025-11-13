import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLinkWithHref, MatToolbarModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('StudentApp');
  readonly user$ = inject(AuthService).user$;
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  logout() {
    this.auth.signOut().subscribe(() => {
      this.snackBar.open('Logged out', 'Close', { duration: 1400 });
      this.router.navigate(['/login']);
    }, () => {
      this.snackBar.open('Sign-out failed', 'Close', { duration: 1800 });
    });
  }
}
