import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuestoCapacitacionComponent } from './puesto-capacitacion.component';

describe('PuestoCapacitacionComponent', () => {
  let component: PuestoCapacitacionComponent;
  let fixture: ComponentFixture<PuestoCapacitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuestoCapacitacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PuestoCapacitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
