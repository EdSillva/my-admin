import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../app/material.component';
import { Employee, EmployeeService } from './employees.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, EmployeeFormComponent],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent {
  employees: Employee[] = [];
  dataSource: MatTableDataSource<Employee> = new MatTableDataSource<Employee>();
  employeeFormComponent = EmployeeFormComponent;
  isFormVisible: boolean = false;
  selectedEmployee: Employee | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe((data) => {
      this.employees = data;
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createEmployee() {
    const newEmployee: Employee = {
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

    this.selectedEmployee = newEmployee;
    this.isFormVisible = true;

    this.employeeService.createEmployee(newEmployee).subscribe((data) => {
      this.selectedEmployee = data;
      this.isFormVisible = true;
      this.dataSource.data = this.employees;
    });
  }

  editEmployee(employee: Employee) {
    const id = employee.id as number;

    this.employeeService.updateEmployee(id, employee).subscribe((data) => {
      this.selectedEmployee = data;
      this.isFormVisible = true;
      this.dataSource.data = this.employees;
    });
  }

  deleteEmployee(id: number): void {
    if (!id) {
      console.log('ID inválido:', id);
      console.error('ID inválido para exclusão!');
      return;
    }

    if (confirm('Tem certeza que deseja deletar este funcionário?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.employees = this.employees.filter((e) => e.id !== id);
        this.dataSource.data = this.employees;
      });
    }
  }
}
