import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class S3DriveService {
  private API_ENDPOINT =
    'https://pjh90hyg4i.execute-api.us-east-1.amazonaws.com/test';

  constructor(private http: HttpClient) {}

  getPresignedUrl(fileName: string, fileType: string): Observable<any> {
    const body = { fileName, fileType };
    return this.http.post(this.API_ENDPOINT + '/S3Drive', body).pipe(
      catchError((error) => {
        console.error('Presigned URL generation failed: ', error);
        return EMPTY;
      })
    );
  }

  uploadFile(file: File): void {
    this.getPresignedUrl(file.name, file.type)
      .pipe(
        map((response) => response.presignedUrl),
        switchMap((presignedUrl) => {
          const headers = new HttpHeaders({
            'Content-Type': file.type
          });
          console.log('Uploading file to: ', presignedUrl);
          return this.http.put(presignedUrl, file, { headers: headers });
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Upload successful!', response);
        },
        error: (error) => {
          console.error('Upload failed:', error);
        }
      });
  }
}
