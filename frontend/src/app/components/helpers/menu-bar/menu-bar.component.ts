import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { TranslateService } from '@ngx-translate/core';
import {Subscription} from "rxjs";
import { Language } from '../language-selector/language.model';
import { MenuItem } from './menu-bar.model';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [RouterLink, MatToolbarModule, MatButtonModule, LanguageSelectorComponent],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss'
})
export class MenuBarComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  @Input() menuItems: MenuItem[] = [];

  constructor(private translate: TranslateService) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    if (this.menuItems.length === 0) return;
    
    // Init Translation Keys
    this.menuItems.forEach((item) => {
      item.trID = `app.menu-bar.${item.trID}`;
    });
    //
    this.subscription = this.translate
    .stream((this.menuItems.map((e) => e.trID)))
    .subscribe((translations: Record<string, string>) => {
      this.menuItems.forEach(e => {
        e.label = translations[e.trID]
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // List of supported languages
  languages: Language[] = [
    { code: 'en', name: 'English', flagIcon: '🇺🇸🇬🇧' },
    { code: 'de', name: 'German', flagIcon: '🇩🇪' },
    { code: 'by', name: 'Belarusian', flagIcon: '🇧🇾' },
    { code: 'ru', name: 'Russian', flagIcon: '🇷🇺' },
  ];

  onLanguageSelected(language: Language) {
    this.translate.use(language.code);
  }
}
