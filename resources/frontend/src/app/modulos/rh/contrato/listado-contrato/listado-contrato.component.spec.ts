import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoContratoComponent } from './listado-contrato.component';

describe('ListadoContratoComponent', () => {
  let component: ListadoContratoComponent;
  let fixture: ComponentFixture<ListadoContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoContratoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
