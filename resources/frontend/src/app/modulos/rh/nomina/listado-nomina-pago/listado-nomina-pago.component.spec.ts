import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoNominaPagoComponent } from './listado-nomina-pago.component';

describe('ListadoNominaPagoComponent', () => {
  let component: ListadoNominaPagoComponent;
  let fixture: ComponentFixture<ListadoNominaPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoNominaPagoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoNominaPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
