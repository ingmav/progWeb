import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardexComponent } from './cardex.component';

describe('CardexComponent', () => {
  let component: CardexComponent;
  let fixture: ComponentFixture<CardexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
