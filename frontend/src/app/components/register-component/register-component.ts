import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../services/register-service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-register-component',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  private registerService = inject(RegisterService);
  public router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit(){
    if(this.form.valid){
      const { email, password } = this.form.value as any;
      this.registerService.register(email, password).subscribe((res:any) => {
        // Log full response for debugging
        // eslint-disable-next-line no-console
        console.log('Supabase signUp response:', res);
        if (res?.error) {
          const message = res.error.message || JSON.stringify(res.error);
          this.snackBar.open(message, 'Close', { duration: 5000 });
        } else if (res?.data?.user || res?.data?.session) {
          this.snackBar.open('Registration successful. Check your email to confirm.', 'Close', { duration: 3500 });
          setTimeout(() => this.router.navigate(['/login']), 800);
        } else {
          // Unexpected shape
          const msg = JSON.stringify(res);
          this.snackBar.open(msg, 'Close', { duration: 5000 });
        }
      }, err => {
        // Network or unexpected error
        // eslint-disable-next-line no-console
        console.error('Registration error:', err);
        const message = err?.message || JSON.stringify(err) || 'Registration error';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
