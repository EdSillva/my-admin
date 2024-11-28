import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModule } from '../../app/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { enumStatus, Project, ProjectService } from './projects.service';
import { Employee, EmployeeService } from '../employees/employees.service';
import { ProjectFormComponent } from '../../components/project-form/project-form.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    MatSelectModule,
    CommonModule,
    ProjectFormComponent,
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  dataSource: MatTableDataSource<Project> = new MatTableDataSource<Project>();
  projects: Project[] = [];
  employees: Employee[] = [];
  projectForm: FormGroup;
  isFormVisible: boolean = false;
  selectedProject: Project | null = null;
  loading: boolean = false;

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ) {
    this.projectForm = this.fb.group({
      numProject: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      initialDate: ['', Validators.required],
      finalDate: ['', Validators.required],
      status: ['', Validators.required],
      leaderId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.employeeService.getEmployees().subscribe({
          next: (employees) => {
            this.employees = employees;
            this.projects = projects.map((project) => {
              const leader = employees.find((e) => e.id === project.leaderId);
              return {
                ...project,
                leaderName: leader ? leader.name : 'Não definido', // Associa o nome do líder ou valor padrão
              };
            });
            this.dataSource.data = this.projects;
            this.loading = false;
          },
          error: (error) => {
            console.error('Erro ao carregar funcionários:', error);
            this.loading = false;
          },
        });
      },
      error: (error) => {
        console.error('Erro ao carregar projetos:', error);
        this.loading = false; // Desativar o loading em caso de erro
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createProject() {
    this.selectedProject = {
      id: 0,
      numProject: 0,
      name: '',
      description: '',
      leaderId: 0,
      status: enumStatus.NOT_STARTED, // Definir status padrão,
      initialDate: new Date(), // Definir data inicial padrão
      finalDate: new Date(), // Definir data final padrão
    };

    this.isFormVisible = true;
    this.projectForm.reset();
  }

  editProject(project: Project): void {
    this.selectedProject = project;
    this.isFormVisible = true;
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const projectData: Project = {
        ...this.projectForm.value,
        id: this.selectedProject?.id ?? 0,
        leaderId: Number(this.projectForm.value.leaderId),
      };

      if (projectData.id === 0) {
        this.projectService.createProject(projectData).subscribe((data) => {
          this.projects.push(data);
          this.dataSource.data = [...this.projects]; // Garante que o Angular detecta a mudança
          this.isFormVisible = false;
        });
      } else {
        this.projectService
          .updateProject(projectData.id!, projectData)
          .subscribe((data) => {
            const index = this.projects.findIndex((p) => p.id === data.id);
            this.projects[index] = data; // Atualiza o projeto
            this.dataSource.data = [...this.projects]; // Garante que o Angular detecta a mudança
            this.isFormVisible = false;
          });
      }
    } else {
      console.log('Formulário inválido:', this.projectForm.errors);
    }
  }

  closeForm() {
    this.isFormVisible = false;
    this.projectForm.reset();
  }

  deleteProject(id: number): void {
    if (!id) {
      console.log('ID inválido:', id);
      console.error('ID inválido para exclusão!');
      return;
    }

    if (confirm('Tem certeza que deseja deletar este projeto?')) {
      this.projectService.deleteProject(id).subscribe(() => {
        this.projects = this.projects.filter((p) => p.id !== id);
        this.dataSource.data = [...this.projects]; // Garante que o Angular detecta as mudanças
      });
      3;
    }
  }
}
