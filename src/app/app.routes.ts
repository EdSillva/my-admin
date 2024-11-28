import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from '../modules/login/login.component';
import { HomeComponent } from '../modules/home/home.component';
import { EmployeesComponent } from '../modules/employees/employees.component';
import { ProjectsComponent } from '../modules/projects/projects.component';

import { MaterialModule } from './material.module';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'employee', component: EmployeesComponent },
  { path: 'projects', component: ProjectsComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    LoginComponent,
    EmployeesComponent,
    ProjectsComponent,
    AppComponent,
    MaterialModule,
  ],
  exports: [RouterModule],
})
export class AppModule {}
