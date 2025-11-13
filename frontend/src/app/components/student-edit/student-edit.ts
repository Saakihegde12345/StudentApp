import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentService } from '../../services/student-service';
import { Student } from '../../models/student.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-edit',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './student-edit.html',
  styleUrl: './student-edit.css',
})
export class StudentEdit implements OnInit{
  private activatedRouter = inject(ActivatedRoute);
  private studentService = inject(StudentService);
  public router = inject(Router);
  studentId!: string;
  student!: Student;
  form!: FormGroup;
  private snackBar = inject(MatSnackBar);

  ngOnInit(){
    //Get customer id from the url
    this.studentId = this.activatedRouter.snapshot.params['id'];
    this.form = new FormGroup({
      name: new FormControl('',Validators.required),
      usn: new FormControl('',[Validators.required, Validators.pattern(/^[A-Za-z0-9]{6,20}$/)]),
      email: new FormControl('', [Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)])
    })
    if(this.studentId){
      this.studentService.getById(this.studentId).subscribe(
        data => {
          this.student = data;
          this.form.patchValue(data);
        },
        error => {
          console.error(error);
        }
      )
    }
  }

  onSubmit() {
    if(this.form.valid){
      this.studentService.put(this.studentId,this.form.value).subscribe(
        data => {
          console.log('data posted:',data);
          try{ this.snackBar.open('Student updated', 'Close', { duration: 2200 }); } catch(e){}
          setTimeout(() => this.router.navigate(['/']), 600);
        },
        error => {
          console.error(error);
        }
      )
    }
  }
}
