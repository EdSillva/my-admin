import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { EmployeeService } from '../employees/employees.service';

export enum enumStatus {
  IN_PROGRESS = 'EM ANDAMENTO',
  COMPLETED = 'CONCLUÍDO',
  CANCELED = 'ABORTADO',
  NOT_STARTED = 'NÃO INICIADO',
}
export interface Project {
  id?: number;
  numProject: number;
  name: string;
  description: string;
  initialDate: Date;
  finalDate: Date;
  status: enumStatus;
  leaderId: number; // ID do líder do projeto
  leader?: string; // Nome do líder (opcional, para exibição)
}
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = 'http://localhost:8081/api/v1/projects';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
