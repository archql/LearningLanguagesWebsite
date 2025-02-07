import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LanguageSelectorComponent } from "../../helpers/language-selector/language-selector.component"; // Add this import
import { Language } from '../../helpers/language-selector/language.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, LanguageSelectorComponent, TranslateModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService, private router: Router
  ) {
    this.registerForm = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      language: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required]]
    });
  }

  // List of supported languages to learn
  languages: Language[] = [
    { code: 'en', name: 'English', flagIcon: '🇺🇸🇬🇧' },
    { code: 'de', name: 'German', flagIcon: '🇩🇪' },
  ];

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const repeatPassword = form.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { mismatch: true };
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    // Simulate registration logic
    const login = this.registerForm.value.login;
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;

    // Replace this with your actual registration API call
    if (login && email && password) {
      this.showNotification('Registration successful!', 'success');
    } else {
      this.showNotification('Registration failed. Please try again.', 'error');
    }
  }

  // Helper method to show notifications
  showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Notification will auto-close after 3 seconds
      // panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}