import { TestBed } from '@angular/core/testing';

import { ServicioArticuloService } from './servicio-articulo.service';

describe('ServicioArticuloService', () => {
  let service: ServicioArticuloService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioArticuloService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
