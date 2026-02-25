import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCallback } from './login-callback';

describe('LoginCallback', () => {
  let component: LoginCallback;
  let fixture: ComponentFixture<LoginCallback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginCallback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginCallback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
