import { TestBed } from '@angular/core/testing';

import { Protocol2Service } from './protocol2.service';

describe('Protocol2Service', () => {
  let service: Protocol2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Protocol2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
