import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoNominaComponent } from './listado-nomina.component';

describe('ListadoNominaComponent', () => {
  let component: ListadoNominaComponent;
  let fixture: ComponentFixture<ListadoNominaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoNominaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoNominaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
