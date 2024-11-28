import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../app/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, MaterialModule],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  matricula: string = '';
  senha: string = '';

  constructor(private router: Router) {}

  login() {
    if (this.matricula && this.senha) {
      this.router.navigate(['/home']);
    } else {
      alert('Matrícula ou senha inválida!');
    }
  }
}
