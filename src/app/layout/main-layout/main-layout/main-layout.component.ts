import { Component } from '@angular/core';
import { HeaderComponent } from "@app/shared/components/header/header.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@app/shared/components/footer/footer.component';

@Component({
  selector: 'app-main-layout',
  imports: [HeaderComponent, RouterOutlet, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}
