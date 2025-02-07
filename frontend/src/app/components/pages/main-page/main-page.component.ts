import { Component } from '@angular/core';
import { MenuBarComponent } from "../../helpers/menu-bar/menu-bar.component";
import { MenuItem } from '../../helpers/menu-bar/menu-bar.model';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from 'express';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [MenuBarComponent, TranslateModule, RouterOutlet],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  menuItems: MenuItem[] = [
    { trID: 'main', label: 'Main', link: 'main' },
    { trID: 'register', label: 'Register', link: 'register' },
    { trID: 'login', label: 'Login', link: 'login' },
  ];
}
