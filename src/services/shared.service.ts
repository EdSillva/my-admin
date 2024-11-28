import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import {
  Employee,
  EmployeeService,
} from '../modules/employees/employees.service';
import { Project, ProjectService } from '../modules/projects/projects.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private employeeService: EmployeeService) {}

  getProjectsWithLeaders(projects: Project[]): Observable<Project[]> {
    const leaderRequests = projects.map((project) => {
      return this.employeeService.getEmployeeById(project.leaderId).pipe(
        map((leader) => {
          project.leader = leader.name;
          return project;
        })
      );
    });
    return forkJoin(leaderRequests);
  }
}
