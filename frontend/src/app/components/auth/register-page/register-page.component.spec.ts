import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AuthServiceMock } from '../../../services/mock/authentication.service.mock';
import { RegisterPageComponent } from './register-page.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../../services/authentication.service';

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;
  let authServiceMock: AuthService;
  let router: Router;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule, TranslateModule.forRoot(), RegisterPageComponent],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } },
        TranslateService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    authServiceMock = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register successfully', () => {
    component.registerForm.setValue({
      login: 'testuser',
      email: 'test@example.com',
      language: component.languages[0],
      password: 'password123',
      repeatPassword: 'password123'
    });

    spyOn(authServiceMock, 'register').and.returnValue(of({ result: true }));

    component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
    expect(snackBar.open).toHaveBeenCalledWith(component.tr['app.dialog.register.success'], component.tr['app.dialog.close'], jasmine.any(Object));
  });

  it('should show error on registration failure', () => {
    component.registerForm.setValue({
      login: 'testuser',
      email: 'test@example.com',
      language: component.languages[0],
      password: 'password123',
      repeatPassword: 'password123'
    });

    spyOn(authServiceMock, 'register').and.returnValue(of({ result: false }));

    component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith(component.tr['app.dialog.register.fail'], component.tr['app.dialog.close'], jasmine.any(Object));
  });

  it('should show error on invalid form', () => {
    component.registerForm.setValue({
      login: '',
      email: 'invalid-email',
      language: component.languages[0],
      password: 'pass',
      repeatPassword: 'pass'
    });

    component.onSubmit();

    expect(snackBar.open).toHaveBeenCalledWith(component.tr['app.dialog.login.invalid-form'], component.tr['app.dialog.close'], jasmine.any(Object));
  });
});
