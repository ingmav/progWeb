import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCatalogoDialogComponent } from './form-catalogo-dialog.component';

describe('FormCatalogoDialogComponent', () => {
  let component: FormCatalogoDialogComponent;
  let fixture: ComponentFixture<FormCatalogoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCatalogoDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCatalogoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
