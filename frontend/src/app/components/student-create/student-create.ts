import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../../services/student-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-create',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './student-create.html',
  styleUrl: './student-create.css',
})
export class StudentCreate implements OnInit{
  private studenService = inject(StudentService);
  public router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;

  ngOnInit(){
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      usn: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{6,20}$/)]),
      email: new FormControl('', [Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)])
    })
  }

  onSubmit(){
    if(this.form.valid){
      this.studenService.post(this.form.value).subscribe(
        data => {
          console.log("Data Posted: ",data);
          try{ this.snackBar.open('Student created', 'Close', { duration: 2200 }); } catch(e){}
          setTimeout(() => this.router.navigate(['/']), 600);
        },
        error => {
          console.error("An Error Occured: ",error);
        }
      )
    }
    else{
      // mark controls as touched to show validation
      this.form.markAllAsTouched();
      try{ this.snackBar.open('Please fix the errors in the form', 'Close', { duration: 2500 }); } catch(e){}
    }
  }
}
