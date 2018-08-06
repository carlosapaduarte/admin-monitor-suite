import { TestBed, inject } from '@angular/core/testing';

import { RemoveService } from './remove.service';

describe('RemoveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemoveService]
    });
  });

  it('should be created', inject([RemoveService], (service: RemoveService) => {
    expect(service).toBeTruthy();
  }));
});
