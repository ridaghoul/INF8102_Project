import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, switchMap, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class S3DriveService {
  private API_ENDPOINT = "https://d30ubrh652tswz.cloudfront.net";

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const body = { fileName: file.name, fileType: file.type };
    return this.http
      .post(`${this.API_ENDPOINT}/upload-presigned-url`, body)
      .pipe(
        map((response: any) => response.presignedUrl),
        catchError((error) => {
          console.error("POST upload-presigned-url failed:", error);
          return error;
        }),
        switchMap((presignedUrl) => {
          const headers = new HttpHeaders({
            "Content-Type": file.type,
          });
          return this.http.put(presignedUrl, file, {
            headers,
          });
        }),
        catchError((error) => {
          console.error("Using upload presignedUrl failed:", error);
          return error;
        }),
      );
  }

  listFiles(): Observable<string[]> | Observable<any> {
    return this.http.get<string[]>(`${this.API_ENDPOINT}/list-files`).pipe(
      catchError((error) => {
        console.error("List files failed:", error);
        return error;
      }),
    );
  }

  downloadFile(fileName: string): Observable<any> {
    return this.http
      .post(`${this.API_ENDPOINT}/download-presigned-url`, { fileName })
      .pipe(
        catchError((error) => {
          console.error("POST download-presigned-url failed:", error);
          return error;
        }),
      );
  }
}
