import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ComplianceService {
  constructor(private http: HttpClient) {}

  fetchComplianceScript(): Observable<string> {
    const scriptUrl =
      "https://s3.amazonaws.com/yourbucket/piiComplianceCheck.js";
    return this.http.get(scriptUrl, { responseType: "text" });
  }

  checkForCompliance(textContent: string): Observable<any> {
    return this.fetchComplianceScript().pipe(
      map((script) => {
        const verifyCompliance = new Function(
          "textContent",
          script + "; return verifyCompliance(textContent);",
        );
        return verifyCompliance(textContent);
      }),
    );
  }
}
