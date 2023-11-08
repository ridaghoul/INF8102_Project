import { TestBed } from '@angular/core/testing';

import { S3DriveService } from './s3-drive.service';

describe('S3DriveService', () => {
  let service: S3DriveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(S3DriveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
