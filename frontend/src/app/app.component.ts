import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {TranslateService} from "@ngx-translate/core";
import { LoaderWrapperComponent } from "./components/helpers/loader-wrapper/loader-wrapper.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, LoaderWrapperComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isLangLoaded: boolean = false;

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['de', 'en', 'ru', 'by']);
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language');
      if (savedLang) {
        this.translate.use(savedLang).subscribe(() => {
          this.isLangLoaded = true;
        });
      } else {
        this.isLangLoaded = true;
      }
    } else {
      //this.isLangLoaded = true;
    }
  }
}
