import { TestBed } from '@angular/core/testing';

import { AuthServiceMock } from './authentication.service.mock';

describe('AuthenticationServiceMock', () => {
  let service: AuthServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthServiceMock);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false if not logged in', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should return true if logged in', () => {
    localStorage.setItem('token', 'fake-token');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should login with correct credentials', () => {
    service.login('aa@aa', '123').subscribe((response : {token? : string}) => {
      expect(response.token).toBe('fake-token');
      expect(localStorage.getItem('token')).toBe('fake-token');
    });
  });

  it('should not login with incorrect credentials', () => {
    service.login('aa@aa', 'wrongpassword').subscribe(response => {
      expect(response.token).toBe('');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  it('should register with valid details', () => {
    service.register('test@test.com', 'password', 'testuser', 'English').subscribe(response => {
      expect(response.result).toBeTrue();
    });
  });

  it('should not register with invalid details', () => {
    service.register('', '', '', '').subscribe(response => {
      expect(response.result).toBeFalse();
    });
  });
});
