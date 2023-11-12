import { Component, ElementRef, ViewChild } from "@angular/core";
import { ComplianceService } from "@services/compliance/compliance.service";
import { S3DriveService } from "@services/s3-drive/s3-drive.service";
import { Observable, of, throwError } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "OnlyTextS3Drive";
  files$: Observable<string[]>;
  selectedFileUpload: File | null = null;
  isCompliant = false;
  selectedFileDownload: string | null = null;
  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private S3Drive: S3DriveService,
    private complianceService: ComplianceService,
  ) {
    this.files$ = this.S3Drive.listFiles();
  }

  selectFileDownload(fileName: string) {
    this.selectedFileDownload = fileName;
  }

  onFileSelectedUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileUpload = file;
    }
  }

  clearFileDownload() {
    this.selectedFileDownload = null;
  }

  uploadFile() {
    if (!this.selectedFileUpload) {
      window.alert("Please select a file to upload");
      return;
    }
    // if (!this.isCompliant) {
    //   window.alert(
    //     "Please verify compliance before uploading.",
    //   );
    //   return;
    // }
    this.S3Drive.uploadFile(this.selectedFileUpload as File).subscribe({
      next: () => {
        window.alert("Upload successful!");
        this.files$ = this.S3Drive.listFiles();
      },
      error: () => {
        window.alert("Upload failed!");
      },
    });
    this.selectedFileUpload = null;
    this.fileInput.nativeElement.value = "";
  }

  clearFileUpload() {
    this.selectedFileUpload = null;
    this.fileInput.nativeElement.value = "";
  }

  checkCompliance(): void {
    if (!this.selectedFileUpload) {
      window.alert("Please select a file to check for compliance");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const textContent = reader.result as string;
      this.complianceService.checkForCompliance(textContent).subscribe({
        next: (isCompliant) => {
          if (isCompliant) {
            this.isCompliant = true;
            window.alert(
              "The file is compliant. You can proceed with the upload.",
            );
          } else {
            this.isCompliant = false;
            window.alert(
              "The file is not compliant. Please verify it before uploading.",
            );
          }
        },
        error: (error: any) => {
          window.alert("Compliance check failed!");
          console.error("Error in compliance check:", error);
        },
      });
    };
    reader.readAsText(this.selectedFileUpload);
  }

  downloadFile() {
    if (!this.selectedFileDownload) {
      window.alert("Please select a file to download");
      return;
    }
    this.S3Drive.downloadFile(this.selectedFileDownload).subscribe({
      next: (blob) => {
        window.open(window.URL.createObjectURL(blob));
      },
      error: () => {
        window.alert("Download failed!");
      },
    });
  }
}
