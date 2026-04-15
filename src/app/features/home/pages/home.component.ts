import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { MenuComponent } from './components/menu/menu.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, FavoritesComponent, MenuComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  
}
