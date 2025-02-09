import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from './authentication.service';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('AuthenticationService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if token exists in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('fake-token');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if token does not exist in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should login and store token in localStorage', () => {
    const mockResponse = { token: 'fake-token' };
    service.login('test@example.com', 'password').subscribe(response => {
      expect(response.token).toBe('fake-token');
      expect(localStorage.getItem('token')).toBe('fake-token');
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle login error', () => {
    service.login('test@example.com', 'password').subscribe(response => {
      expect(response.token).toBe('');
    });

    const req = httpMock.expectOne('/api/auth/login');
    req.flush('Login error', { status: 500, statusText: 'Server Error' });
  });

  it('should register and return success', () => {
    const mockResponse = { result: true };
    service.register('test@example.com', 'password', 'nickname', 'language').subscribe(response => {
      expect(response.result).toBeTrue();
    });

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle register error', () => {
    service.register('test@example.com', 'password', 'nickname', 'language').subscribe(response => {
      expect(response.result).toBeFalse();
    });

    const req = httpMock.expectOne('/api/auth/register');
    req.flush('Register error', { status: 500, statusText: 'Server Error' });
  });

  it('should logout and remove token from localStorage', () => {
    spyOn(localStorage, 'removeItem');
    spyOn(router, 'navigate');

    service.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(router.navigate).toHaveBeenCalledWith(['/main']);
  });
});
