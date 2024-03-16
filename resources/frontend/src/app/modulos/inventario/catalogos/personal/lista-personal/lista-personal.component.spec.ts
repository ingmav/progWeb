import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPersonalComponent } from './lista-personal.component';

describe('ListaPersonalComponent', () => {
  let component: ListaPersonalComponent;
  let fixture: ComponentFixture<ListaPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPersonalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
