import { TestBed } from '@angular/core/testing';

import { ScreenOrientationService } from './screen-orientation.service';

describe('ScreenOrientationService', () => {
  let service: ScreenOrientationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenOrientationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
