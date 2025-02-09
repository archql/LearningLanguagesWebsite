import { TestBed } from '@angular/core/testing';

import { AuthServiceMock } from './authentication.service.mock';

describe('AuthenticationServiceMock', () => {
  let service: AuthServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthServiceMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
