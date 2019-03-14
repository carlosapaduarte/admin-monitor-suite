import { TestBed } from '@angular/core/testing';

import { OpenDataService } from './open-data.service';

describe('OpenDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpenDataService = TestBed.get(OpenDataService);
    expect(service).toBeTruthy();
  });
});
