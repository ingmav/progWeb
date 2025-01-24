import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarCapacitacionDialogComponent } from './asignar-capacitacion-dialog.component';

describe('AsignarCapacitacionDialogComponent', () => {
  let component: AsignarCapacitacionDialogComponent;
  let fixture: ComponentFixture<AsignarCapacitacionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarCapacitacionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsignarCapacitacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
