import { TestBed } from '@angular/core/testing';

import { ProtocolHandlerService } from './protocol-handler.service';

describe('ProtocolHandlerService', () => {
  let service: ProtocolHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProtocolHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
