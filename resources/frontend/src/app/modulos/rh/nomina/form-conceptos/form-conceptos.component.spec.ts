import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConceptosComponent } from './form-conceptos.component';

describe('FormConceptosComponent', () => {
  let component: FormConceptosComponent;
  let fixture: ComponentFixture<FormConceptosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormConceptosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormConceptosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
