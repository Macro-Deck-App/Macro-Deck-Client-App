import { TestBed } from '@angular/core/testing';

import { MacroDeckService } from './macro-deck.service';

describe('MacroDeckService', () => {
  let service: MacroDeckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MacroDeckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
