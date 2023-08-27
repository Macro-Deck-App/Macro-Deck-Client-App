import { TestBed } from '@angular/core/testing';

import { CurrentPlatformService } from './current-platform.service';

describe('CurrentPlatformService', () => {
  let service: CurrentPlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentPlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
