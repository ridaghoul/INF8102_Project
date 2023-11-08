import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HIPAAComplianceService {
  constructor(private http: HttpClient) {}

  fetchComplianceScript(): Observable<string> {
    const scriptUrl =
      "https://s3.amazonaws.com/yourbucket/piiComplianceCheck.js";
    return this.http.get(scriptUrl, { responseType: "text" });
  }

  checkForHIPAACompliance(textContent: string): Observable<any> {
    return this.fetchComplianceScript().pipe(
      map((script) => {
        const checkForHIPAACompliance = new Function(
          "textContent",
          script + "; return checkForHIPAACompliance(textContent);",
        );
        return this.checkForHIPAACompliance(textContent);
      }),
    );
  }
}
