import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInCmpComponent } from './sign-in-cmp.component';

describe('SignInComponent', () => {
  let component: SignInCmpComponent;
  let fixture: ComponentFixture<SignInCmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInCmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInCmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
