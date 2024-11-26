import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../app/material.component';
import { MatSelectModule } from '@angular/material/select';
import { Project, ProjectService } from './projects.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [MaterialModule, MatSelectModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  dataSource: MatTableDataSource<Project> = new MatTableDataSource<Project>();

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((data) => {
      this.projects = data;
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createProject() {
    console.log('Criar projeto');
    // Aqui você pode abrir um modal ou navegar para um formulário de criação
  }

  editProject(project: Project) {
    console.log('Editar projeto', project);
    // Navegue para o formulário de edição ou abra um modal
  }

  deleteProject(projectId: number) {
    if (confirm('Tem certeza que deseja deletar este projeto?')) {
      this.projectService.deleteProject(projectId).subscribe(() => {
        this.projects = this.projects.filter((p) => p.id !== projectId);
        this.dataSource.data = this.projects;
      });
    }
  }
}
