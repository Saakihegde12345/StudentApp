import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login-service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';



@Component({
  selector: 'app-login-component',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  private loginService = inject(LoginService);
  public router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit() {
    if (this.form.valid) {
      const { email, password } = this.form.value as any;
      this.loginService.login(email, password).subscribe(
        (res: any) => {
          if (res.error) {
            this.snackBar.open(res.error.message || 'Login failed', 'Close', { duration: 3000 });
          } else {
              this.snackBar.open('Login successful', 'Close', { duration: 1500 });
            setTimeout(() => this.router.navigate(['/']), 600);
          }
        },
        err => this.snackBar.open('Login error', 'Close', { duration: 3000 })
      );
    } else {
      this.form.markAllAsTouched();
    }
  }
}
