import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Language } from './language.model';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [FormsModule, MatSelectModule, MatFormFieldModule, TranslateModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LanguageSelectorComponent),
      multi: true,
    },
  ],
})
export class LanguageSelectorComponent implements ControlValueAccessor, OnInit, OnDestroy {
  private subscription: Subscription;

  @Input() languages: Language[] = [];
  @Input() defaultLanguage?: Language;

  @Input()
  set defaultLanguageCode(value: string | undefined) {
    this.defaultLanguage = this.languages.find((e) => e.code === value);
  }

  @Output() languageSelected = new EventEmitter<Language>();

  constructor(private translate: TranslateService) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    if (this.languages.length === 0) return;
    //
    this.defaultLanguage = this.defaultLanguage || this.languages[0]; // Use default language if provided
    // Init Translation Keys
    this.languages.forEach((item) => {
      item.trID = `app.language.${item.code}`;
    });

    this.subscription = this.translate
      .stream(this.languages.map((e) => e.trID!))
      .subscribe((translations: Record<string, string>) => {
        this.languages.forEach((e) => {
          e.name = translations[e.trID!];
        });
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // ControlValueAccessor methods
  writeValue(value: Language): void {
    if (value) {
      this.defaultLanguage = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private onChange: any = () => {};
  private onTouched: any = () => {};

  // Handle language selection
  onLanguageSelect(language: Language): void {
    this.languageSelected.emit(language);
    this.defaultLanguage = language;
    this.onChange(language); // Notify the form of the change
    this.onTouched(); // Mark the control as touched
  }
}