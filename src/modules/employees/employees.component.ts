import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../app/material.module';
import { Employee, EmployeeService } from './employees.service';
import { EmployeeFormComponent } from '../../components/employee-form/employee-form.component';
import { Project } from '../projects/projects.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, EmployeeFormComponent],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent {
  dataSource: MatTableDataSource<Employee> = new MatTableDataSource<Employee>();
  employeeForm: FormGroup;
  isFormVisible: boolean = false;
  employees: Employee[] = [];
  projects: Project[] = [];
  selectedEmployee: Employee | null = null;
  loading: boolean = false;

  constructor(
    private sharedService: SharedService,
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      matricula: ['', Validators.required],
      experience: ['', Validators.required],
      linkedin: ['', Validators.required],
      phone: ['', Validators.required],
      certifications: [[]],
      technicalSkills: [[]],
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  getProjectName(projectId: number): string {
    const project = this.projects.find((p) => p.id === projectId);
    return project ? project.name : ''; // Retorna o nome ou uma string vazia
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.dataSource.data = this.employees;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar funcionários', error);
        this.loading = false;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createEmployee() {
    this.selectedEmployee = {
      id: 0,
      name: '',
      email: '',
      experience: 0,
      matricula: 0,
      linkedin: '',
      phone: '',
      technicalSkills: [],
      certifications: [],
    };
    this.isFormVisible = true;
    this.employeeForm.reset();
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const employee: Employee = {
        ...this.employeeForm.value,
        id: this.selectedEmployee?.id ?? 0,
      };

      if (employee.id === 0) {
        this.employeeService.createEmployee(employee).subscribe((data) => {
          this.employees.push(data);
          this.dataSource.data = [...this.employees];
          this.isFormVisible = false;
        });
      } else {
        this.employeeService
          .updateEmployee(employee.id!, employee)
          .subscribe((data) => {
            const index = this.employees.findIndex((e) => e.id === employee.id);
            this.employees[index] = data;
            this.dataSource.data = [...this.employees];
            this.isFormVisible = false;
          });
      }
    } else {
      console.log('Formulário inválido');
    }
  }

  closeForm() {
    this.isFormVisible = false;
    this.employeeForm.reset();
  }

  editEmployee(employee: Employee) {
    this.selectedEmployee = employee;
    this.isFormVisible = true;
  }

  deleteEmployee(id: number): void {
    if (!id) {
      console.log('ID inválido:', id);
      console.error('ID inválido para exclusão!');
      return;
    }

    if (confirm('Tem certeza que deseja deletar este funcionário?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          // Atualiza a lista de funcionários após exclusão bem-sucedida
          this.employees = this.employees.filter((e) => e.id !== id);
          this.dataSource.data = [...this.employees];
          alert('Funcionário excluído com sucesso.');
        },
        error: (error) => {
          if (error.status === 409) {
            alert(
              'Erro: Não é possível excluir este funcionário porque ele está vinculado a um projeto.'
            );
          } else {
            alert('Erro: Ocorreu um problema ao tentar excluir o funcionário.');
          }
          console.error('Erro ao excluir funcionário:', error);
        },
      });
    }
  }
}
