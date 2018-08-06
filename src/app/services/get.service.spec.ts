import { TestBed, inject } from '@angular/core/testing';

import { GetService } from './get.service';

describe('GetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetService]
    });
  });

  it('should be created', inject([GetService], (service: GetService) => {
    expect(service).toBeTruthy();
  }));
});
