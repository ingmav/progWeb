import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCapacitacionDialogComponent } from './form-capacitacion-dialog.component';

describe('FormCapacitacionDialogComponent', () => {
  let component: FormCapacitacionDialogComponent;
  let fixture: ComponentFixture<FormCapacitacionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCapacitacionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCapacitacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
