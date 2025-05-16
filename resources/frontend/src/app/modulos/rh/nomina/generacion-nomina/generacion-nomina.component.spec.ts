import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneracionNominaComponent } from './generacion-nomina.component';

describe('GeneracionNominaComponent', () => {
  let component: GeneracionNominaComponent;
  let fixture: ComponentFixture<GeneracionNominaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneracionNominaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneracionNominaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
