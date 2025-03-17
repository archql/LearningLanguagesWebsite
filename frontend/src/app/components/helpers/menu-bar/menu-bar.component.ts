import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { TranslateService } from '@ngx-translate/core';
import {Subscription} from "rxjs";
import { InterfaceLanguages, Language } from '../language-selector/language.model';
import { MenuItem } from './menu-bar.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [RouterLink, FormsModule, MatToolbarModule, MatButtonModule, LanguageSelectorComponent],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss'
})
export class MenuBarComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  @Input() menuItems: MenuItem[] = [];

  constructor(private translate: TranslateService, private router: Router) {
    this.subscription = new Subscription();

    // if (typeof window !== 'undefined') { 
    //   const savedLanguageCode = localStorage.getItem('language');
    //   if (savedLanguageCode) {
    //     const savedLanguage = this.languages.find(lang => lang.code === savedLanguageCode);
    //     if (savedLanguage) {
    //       this.selectedLanguage = savedLanguage;
    //     }
    //   }
    // }
    let savedLanguageCode = 'en';
    if (typeof window !== 'undefined') {
      savedLanguageCode = localStorage.getItem('language') || savedLanguageCode;
    }
    const savedLanguage = this.languages.find(lang => lang.code === savedLanguageCode);
    if (savedLanguage) {
      this.selectedLanguage = savedLanguage;
    }
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
  languages: Language[] = InterfaceLanguages;
  selectedLanguage?: Language;

  onLanguageSelected(language: Language) {  
    this.translate.use(language.code);
    //
    this.selectedLanguage = language;
    if (typeof window !== 'undefined') { 
      localStorage.setItem('language', language.code);
    }
  }

  redirectToHome() {
    this.router.navigate(['/home']);
  }
}
