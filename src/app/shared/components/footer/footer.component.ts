import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  locations = [
    {
      city: 'Cordoba',
      address: '123 Street, Villa Allende',
      phone: '(206) 555-####',
      hours: 'Mon-Sun: 6am - 8pm'
    }
  ];
}
