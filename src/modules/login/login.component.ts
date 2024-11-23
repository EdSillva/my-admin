import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
