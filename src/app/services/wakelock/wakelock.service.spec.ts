import { TestBed } from '@angular/core/testing';

import { WakelockService } from './wakelock.service';

describe('WakelockService', () => {
  let service: WakelockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WakelockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
