import { TestBed } from '@angular/core/testing';

import { ComunicationLoginService } from './comunication-login.service';

describe('ComunicationLoginService', () => {
  let service: ComunicationLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComunicationLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
