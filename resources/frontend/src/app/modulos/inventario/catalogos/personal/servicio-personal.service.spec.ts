import { TestBed } from '@angular/core/testing';

import { ServicioPersonalService } from './servicio-personal.service';

describe('ServicioPersonalService', () => {
  let service: ServicioPersonalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioPersonalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
