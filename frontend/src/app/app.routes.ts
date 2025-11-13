import { Routes } from '@angular/router';
import { StudentList } from './components/student-list/student-list';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: StudentList },
  {
    path: 'create',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/student-create/student-create').then(m => m.StudentCreate)
  },
  {
    path: 'edit/:id',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/student-edit/student-edit').then(m => m.StudentEdit)
  },
  { path: 'login', loadComponent: () => import('./components/login-component/login-component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register-component/register-component').then(m => m.RegisterComponent) },
  { path: '**', redirectTo: '' }
];