import { TestBed } from '@angular/core/testing';

import { VectorSearchServiceService } from './vector-search-service.service';

describe('VectorSearchServiceService', () => {
  let service: VectorSearchServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VectorSearchServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
