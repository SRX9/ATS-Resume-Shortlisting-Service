import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpCmpComponent } from './sign-up-cmp.component';

describe('SignUpComponent', () => {
  let component: SignUpCmpComponent;
  let fixture: ComponentFixture<SignUpCmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpCmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpCmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
