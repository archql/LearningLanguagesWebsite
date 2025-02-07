import { Component } from '@angular/core';
import { MenuBarComponent } from "../../helpers/menu-bar/menu-bar.component";
import { RouterOutlet } from '@angular/router';
import { MenuItem } from '../../helpers/menu-bar/menu-bar.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [MenuBarComponent, RouterOutlet],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  menuItems: MenuItem[] = [
    { trID: 'dashboard', label: 'Dashboard', link: 'dashboard' },
    { trID: 'profile', label: 'Profile', link: 'profile' },
    { trID: 'lesson-selection', label: 'Lesson Selection', link: 'lessons' },
    { trID: 'my-vocabulary', label: 'My Vocabulary', link: 'vocabulary' }
  ];
}
