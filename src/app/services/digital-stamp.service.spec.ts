import { TestBed } from '@angular/core/testing';

import { DigitalStampService } from './digital-stamp.service';

describe('DigitalStampService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DigitalStampService = TestBed.get(DigitalStampService);
    expect(service).toBeTruthy();
  });
});
