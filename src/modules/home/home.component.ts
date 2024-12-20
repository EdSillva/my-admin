import { Component } from '@angular/core';
import { MaterialModule } from '../../app/material.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
