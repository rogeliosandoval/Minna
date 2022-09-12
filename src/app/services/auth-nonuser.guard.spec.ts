import { TestBed } from '@angular/core/testing';

import { AuthNonuserGuard } from './auth-nonuser.guard';

describe('AuthNonuserGuard', () => {
  let guard: AuthNonuserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthNonuserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
