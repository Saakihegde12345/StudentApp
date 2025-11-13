import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { StudentService } from '../../services/student-service';
import { Router, RouterLink } from '@angular/router';
import { Student } from '../../models/student.model';

// Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-student-list',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatTooltipModule],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList implements OnInit{
  private studentService = inject(StudentService);
  private router = inject(Router)
  private snackBar = inject(MatSnackBar);

  // Ensure the template can safely read `.length` and iterate even before
  // the server response arrives.
  studentList: Student[] = [];

  ngOnInit(): void {
      this.initData();
  }

  initData(){
    this.studentService.get().subscribe(
      data => {
        this.studentList = data;
      },
      error => {
        console.error("An Error Occured: ", error);
      }
    )
  }

  onDeleteClick(student: Student){
    if(window.confirm("Are you sure you want to delete the student: "+student.name+"?")){
      this.studentService.delete(student._id).subscribe(
        data => {
          this.initData();
          try{
            this.snackBar.open(`${student.name} deleted`, 'Close', { duration: 2500 });
          }catch(e){
            // snackbar might not be available in tests; ignore
          }
        },
        error => {
          console.error("Error Occured: ",error);
        }
      )
    }
  }

  initials(name?: string){
    if(!name) return '';
    const parts = name.trim().split(/\s+/);
    const chars = parts.length > 1 ? parts.slice(0,2).map(p => p[0]) : [parts[0][0]];
    return chars.map(c => c?.toUpperCase() ?? '').join('');
  }
}
