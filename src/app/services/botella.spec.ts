import { TestBed } from '@angular/core/testing';

import { Botella } from './botella';

describe('Botella', () => {
  let service: Botella;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Botella);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
