import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from '../modules/login/login.component';
import { HomeComponent } from '../modules/home/home.component';
import { EmployeesComponent } from '../modules/employees/employees.component';
import { ProjectsComponent } from '../modules/projects/projects.component';
import { EmployeeFormComponent } from '../modules/employee-form/employee-form.component';

// Importações do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'employee', component: EmployeesComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'employee/create', component: EmployeeFormComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    LoginComponent,
    EmployeesComponent,
    EmployeeFormComponent,
    ProjectsComponent,
    AppComponent,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
  ],
  exports: [RouterModule],
})
export class AppModule {}
