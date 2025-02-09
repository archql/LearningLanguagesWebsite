import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar'; // Add this import
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatProgressSpinnerModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, TranslateModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;

  private subscription: Subscription;
  loading: boolean = false;
  
  private trIDs = [
    'app.dialog.login.success',
    'app.dialog.login.wrong-credentials',
    'app.dialog.login.invalid-form',
    'app.dialog.close',
  ];
  tr: Record<string, string> = {};

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router, 
    private snackBar: MatSnackBar, 
    private translate: TranslateService
  ) {
    this.subscription = new Subscription();
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    if (!this.loginForm) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    }
    if (this.trIDs.length === 0) return;
    //
    this.subscription = this.translate
      .stream(this.trIDs)
      .subscribe((translations: Record<string, string>) => {
        this.tr = translations;
      });
  }

  // Convenience getter for easy access to form controls
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form Data:', this.loginForm.value);

      this.loading = true; // Start loading

      const email = this.loginForm.value['email'];
      const password = this.loginForm.value['password'];

      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response.token) {
            this.showNotification(this.tr['app.dialog.login.success'], 'success');
            this.router.navigate(['/home']);
          } else {
            this.showNotification(this.tr['app.dialog.login.wrong-credentials'], 'error');
          }
        },
        error: (error) => {
          console.error('Login failed', error);
          this.showNotification(this.tr['app.dialog.login.error'], 'error');
        },
        complete: () => {
          this.loading = false; // Stop loading
        },
      });
    } else {
      this.showNotification(this.tr['app.dialog.login.invalid-form'], 'error');
    }
  }

  // Helper method to show notifications
  showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, this.tr['app.dialog.close'], {
      duration: 3000, // Notification will auto-close after 3 seconds
      // panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}