import { TestBed } from "@angular/core/testing";

import { HIPAAComplianceService } from "./hipaa-compliance.service";

describe("HIPAAComplianceService", () => {
  let service: HIPAAComplianceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HIPAAComplianceService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
