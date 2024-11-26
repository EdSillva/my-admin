import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Employee } from '../employees/employees.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: 'employees-form.component.html',
  styleUrls: ['employees-form.component.scss'],
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      experience: [0, Validators.required],
      matricula: [0, Validators.required],
      linkedin: ['', Validators.required],
      phone: ['', Validators.required],
      technicalSkills: this.fb.array([]),
      certifications: this.fb.array([]),
    });
  }

  ngOnInit(): void {}

  setEmployee(employee: Employee) {
    this.employeeForm.patchValue({
      name: employee.name,
      email: employee.email,
      experience: employee.experience,
      matricula: employee.matricula,
      linkedin: employee.linkedin,
      phone: employee.phone,
    });

    if (employee.technicalSkills) {
      const skills = this.employeeForm.get('technicalSkills') as FormArray;
      employee.technicalSkills.forEach(
        (skill: { title: string; description: string }) => {
          skills.push(
            this.fb.group({
              title: [skill.title],
              description: [skill.description],
            })
          );
        }
      );
    }

    if (employee.certifications) {
      const certifications = this.employeeForm.get(
        'certifications'
      ) as FormArray;
      employee.certifications.forEach((certification: { title: string }) => {
        certifications.push(
          this.fb.group({
            title: [certification.title],
          })
        );
      });
    }
  }

  // FormArray para skills
  get technicalSkills(): FormArray {
    return this.employeeForm.get('technicalSkills') as FormArray;
  }

  // FormArray para certifications
  get certifications(): FormArray {
    return this.employeeForm.get('certifications') as FormArray;
  }

  // Método para adicionar uma nova Skill
  addTechnicalSkill(skill: any = { title: '', description: '' }) {
    const skillGroup = this.fb.group({
      title: [skill.title, Validators.required],
      description: [skill.description, Validators.required],
    });
    this.technicalSkills.push(skillGroup);
  }

  // Método para remover uma Skill
  removeTechnicalSkill(index: number) {
    this.technicalSkills.removeAt(index);
  }

  // Método para adicionar uma nova Certification
  addCertification(cert: any = { title: '' }) {
    const certGroup = this.fb.group({
      title: [cert.title, Validators.required],
    });
    this.certifications.push(certGroup);
  }

  // Método para remover uma Certification
  removeCertification(index: number) {
    this.certifications.removeAt(index);
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      console.log(this.employeeForm.value);
      this.setEmployee(this.employeeForm.value);
    }
  }
}
