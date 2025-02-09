import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LanguageSelectorComponent } from "../../helpers/language-selector/language-selector.component"; // Add this import
import { Language, LearningLanguages } from '../../helpers/language-selector/language.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [MatCardModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, LanguageSelectorComponent, TranslateModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  registerForm: FormGroup;

  private subscription: Subscription;
  loading: boolean = false;
    
  private trIDs = [
    'app.dialog.register.success',
    'app.dialog.register.fail',
    'app.dialog.login.invalid-form', // same as register
    'app.dialog.close',
  ];
  tr: Record<string, string> = {};

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    if (this.trIDs.length === 0) return;
    this.subscription = this.translate
      .stream(this.trIDs)
      .subscribe((translations: Record<string, string>) => {
        this.tr = translations;
      });
  }

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService, 
    private router: Router,
    private translate: TranslateService
  ) {
    this.registerForm = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      language: [this.languages[0], [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordMatchValidator('repeatPassword', true)]],
      repeatPassword: ['', [Validators.required, this.passwordMatchValidator('password')]],
    });
    this.subscription = new Subscription();
  }

  // List of supported languages to learn
  languages: Language[] = LearningLanguages;

  // Custom validator to check if passwords match
  private passwordMatchValidator(matchTo: string, reverse?: boolean): ValidatorFn {
    return (control: AbstractControl): 
    ValidationErrors | null => 
    {
      if (control.parent && reverse) {
        const c = (control.parent?.controls as any)[matchTo];
        if (c) {
          c.updateValueAndValidity();
        }
        return null;
      }
      return !!control.parent &&
      !!control.parent.value &&
      control.value === 
      (control.parent?.controls as any)[matchTo].value
      ? null
      : { mismatch: true };
    };
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.showNotification(this.tr['app.dialog.login.invalid-form'], 'error');
      return;
    }
    console.log('Form Data:', this.registerForm.value);

    const login = this.registerForm.value.login;
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const language = this.registerForm.value.language.code;

    if (login && email && password && language) {
      this.loading = true; // Start loading

      this.authService.register(email, password, login, language).subscribe({
        next: (response) => {
          if (response.result) {
            this.showNotification(this.tr['app.dialog.register.success'], 'success');
            this.router.navigate(['/home']);
          } else {
            this.showNotification(this.tr['app.dialog.register.fail'], 'error');
          }
        },
        error: (error) => {
          console.error('Login failed', error);
          this.showNotification(this.tr['app.dialog.register.fail'], 'error');
        },
        complete: () => {
          console.log('Registration complete');
          this.loading = false; 
        },
      });
    }
  }

  // Helper method to show notifications
  showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, this.tr['app.dialog.close'], {
      duration: 3000, // Notification will auto-close after 3 seconds
      // panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}