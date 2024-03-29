import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPersonalComponent } from './form-personal.component';

describe('FormPersonalComponent', () => {
  let component: FormPersonalComponent;
  let fixture: ComponentFixture<FormPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPersonalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
