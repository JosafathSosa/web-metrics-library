import { TestBed } from '@angular/core/testing';

import { WebVitalsService } from './web-vitals.service';

describe('WebVitalsService', () => {
  let service: WebVitalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebVitalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
