import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitacionTrabajadorComponent } from './capacitacion-trabajador.component';

describe('CapacitacionTrabajadorComponent', () => {
  let component: CapacitacionTrabajadorComponent;
  let fixture: ComponentFixture<CapacitacionTrabajadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapacitacionTrabajadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CapacitacionTrabajadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
