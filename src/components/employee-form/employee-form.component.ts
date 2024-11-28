import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../modules/employees/employees.service';
import {
  Certification,
  Employee,
  TechnicalSkill,
} from '../../modules/employees/employees.service';
import {
  Project,
  ProjectService,
} from '../../modules/projects/projects.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: 'employees-form.component.html',
  styleUrls: ['employees-form.component.scss'],
})
export class EmployeeFormComponent implements OnInit {
  @Input() selectedEmployee: Employee | null = null;
  @Output() closeFormEvent = new EventEmitter<void>();
  @Output() employeeUpdated = new EventEmitter<void>();

  employeeForm: FormGroup;
  technicalSkills: TechnicalSkill[] = [];
  certifications: Certification[] = [];
  projects: Project[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private projectService: ProjectService
  ) {
    this.employeeForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      matricula: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      experience: ['', [Validators.required, Validators.min(0)]],
      linkedin: ['', Validators.required],
      phone: ['', Validators.required],
      technicalSkills: [[]],
      certifications: [[]],
    });
  }

  ngOnInit(): void {
    if (this.selectedEmployee) {
      this.employeeForm.patchValue({
        id: this.selectedEmployee.id,
        name: this.selectedEmployee.name,
        email: this.selectedEmployee.email,
        matricula: this.selectedEmployee.matricula,
        experience: this.selectedEmployee.experience,
        linkedin: this.selectedEmployee.linkedin,
        phone: this.selectedEmployee.phone,
        technicalSkills: this.selectedEmployee.technicalSkills,
        certifications: this.selectedEmployee.certifications,
      });

      this.technicalSkills = [...this.selectedEmployee.technicalSkills];
      this.certifications = [...this.selectedEmployee.certifications];

      this.projectService.getProjects().subscribe((projects) => {
        this.projects = projects;
      });
    }
  }

  closeForm() {
    this.closeFormEvent.emit();
  }

  addTechnicalSkill(title: string, description: string): void {
    if (title && description) {
      const newSkill: TechnicalSkill = {
        id: Date.now(),
        title,
        description,
      };
      this.technicalSkills.push(newSkill);
      this.employeeForm.get('technicalSkills')?.setValue(this.technicalSkills);
    }
  }

  removeTechnicalSkill(index: number): void {
    this.technicalSkills.splice(index, 1);
    this.employeeForm.get('technicalSkills')?.setValue(this.technicalSkills);
  }

  addCertification(title: string): void {
    if (title) {
      const newCertification: Certification = {
        id: Date.now(),
        title,
      };
      this.certifications.push(newCertification);
      this.employeeForm.get('certifications')?.setValue(this.certifications);
    }
  }

  removeCertification(index: number): void {
    this.certifications.splice(index, 1);
    this.employeeForm.get('certifications')?.setValue(this.certifications);
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employee: Employee = this.employeeForm.value;

      if (employee.id) {
        this.employeeService.updateEmployee(employee.id, employee).subscribe({
          next: (updatedEmployee) => {
            console.log('Funcionário atualizado com sucesso:', updatedEmployee);
            alert('Funcionário atualizado!');
            this.closeForm();
            this.employeeUpdated.emit();
          },
          error: (err) => {
            console.error('Erro ao atualizar funcionário:', err);
          },
        });
      } else {
        this.employeeService.createEmployee(employee).subscribe({
          next: (newEmployee) => {
            console.log('Funcionário criado com sucesso:', newEmployee);
            alert('Funcionário criado!');
            this.closeForm();
            this.employeeUpdated.emit();
          },
          error: (err) => {
            console.error('Erro ao criar funcionário:', err);
          },
        });
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }
}
