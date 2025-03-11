import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CanDeactivateGuard, CanComponentDeactivate } from './can-deactivate.guard';

describe('CanDeactivateGuard', () => {
  let guard: CanDeactivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanDeactivateGuard]
    });
    guard = TestBed.inject(CanDeactivateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if canDeactivate returns true', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: () => true
    };
    expect(guard.canDeactivate(component)).toBe(true);
  });

  it('should return false if canDeactivate returns false', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: () => false
    };
    expect(guard.canDeactivate(component)).toBe(false);
  });
});
