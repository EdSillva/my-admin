import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  enumStatus,
  Project,
  ProjectService,
} from '../../modules/projects/projects.service';
import {
  Employee,
  EmployeeService,
} from '../../modules/employees/employees.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
})
export class ProjectFormComponent implements OnInit {
  @Input() selectedProject: Project | null = null;
  @Output() closeFormEvent = new EventEmitter<void>();
  @Output() projectUpdated = new EventEmitter<void>();

  projectForm: FormGroup;
  employees: Employee[] = [];
  enumStatus = enumStatus;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private employeeService: EmployeeService
  ) {
    this.projectForm = this.fb.group({
      id: [null],
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
    console.log('Projeto selecionado:', this.selectedProject?.id);

    if (this.selectedProject) {
      const initialDate = this.selectedProject.initialDate
        ? this.formatDate(this.selectedProject.initialDate)
        : null;
      const finalDate = this.selectedProject.finalDate
        ? this.formatDate(this.selectedProject.finalDate)
        : null;

      this.projectForm.patchValue({
        id: this.selectedProject.id,
        numProject: this.selectedProject.numProject,
        name: this.selectedProject.name,
        description: this.selectedProject.description,
        initialDate: initialDate,
        finalDate: finalDate,
        status: this.selectedProject.status,
        leaderId: this.selectedProject.leaderId,
      });

      this.employeeService.getEmployees().subscribe((employees) => {
        this.employees = employees;
      });
    }
  }

  private formatDate(dateInput: string | Date): string {
    const date = new Date(dateInput); // Garante que qualquer valor seja tratado como uma data
    return date.toISOString().split('T')[0]; // Retorna no formato "YYYY-MM-DD"
  }

  closeForm() {
    this.closeFormEvent.emit();
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const projectData: Project = this.projectForm.value;

      if (projectData.id) {
        this.projectService
          .updateProject(projectData.id, projectData)
          .subscribe({
            next: () => {
              alert('Projeto atualizado com sucesso!');
              this.closeForm();
              this.projectUpdated.emit();
            },
            error: (error) => {
              console.error('Erro ao atualizar projeto:', error);
            },
          });
      } else {
        this.projectService.createProject(projectData).subscribe({
          next: (newProject) => {
            alert('Projeto criado com sucesso!');
            this.closeForm();
            this.projectUpdated.emit();
          },
          error: (error) => {
            console.error('Erro ao criar projeto:', error);
          },
        });
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }
}
