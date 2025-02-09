import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AuthServiceMock } from '../../../services/mock/authentication.service.mock';
import { LoginPageComponent } from './login-page.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../../services/authentication.service';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authServiceMock: AuthService;
  let router: Router;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule, TranslateModule.forRoot(), LoginPageComponent],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } },
        TranslateService,
        BrowserAnimationsModule,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    authServiceMock = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login successfully', () => {
    component.loginForm.setValue({
      email: 'aa@aa',
      password: '123456'
    });

    spyOn(authServiceMock, 'login').and.returnValue(of({ token: 'fake-token' }));

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
    expect(snackBar.open).toHaveBeenCalledWith('app.dialog.login.success', 'app.dialog.close', jasmine.any(Object));
  });

  it('should show error on login failure', () => {
    component.loginForm.setValue({
      email: 'aa@aa',
      password: 'wrongpassword'
    });

    spyOn(authServiceMock, 'login').and.returnValue(of({ token: '' }));

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith('app.dialog.login.wrong-credentials', 'app.dialog.close', jasmine.any(Object));
  });

  it('should show error on invalid form', () => {
    component.loginForm.setValue({
      email: 'invalid-email',
      password: 'short'
    });

    component.onSubmit();

    expect(snackBar.open).toHaveBeenCalledWith('app.dialog.login.invalid-form', 'app.dialog.close', jasmine.any(Object));
  });
});
