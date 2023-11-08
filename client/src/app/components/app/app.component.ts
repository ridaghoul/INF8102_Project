import { Component, ElementRef, ViewChild } from "@angular/core";
import { HIPAAComplianceService } from "@services/pii-compliance/hipaa-compliance.service";
import { S3DriveService } from "@services/s3-drive/s3-drive.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "S3Drive";
  selectedFile: File | null = null;
  isHIPAACompliant = false;
  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;
  constructor(
    private S3Drive: S3DriveService,
    private HIPAAService: HIPAAComplianceService,
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadFile() {
    if (!this.selectedFile) {
      window.alert("Please select a file to upload");
      return;
    }
    // if (!this.isHIPAACompliant) {
    //   window.alert(
    //     "Please verify HIPAA compliance before uploading.",
    //   );
    //   return;
    // }
    this.S3Drive.uploadFile(this.selectedFile as File).subscribe({
      next: (response) => {
        window.alert("Upload successful!");
        console.log("Upload successful!", response);
      },
      error: (error) => {
        window.alert("Upload failed!");
        console.error("Upload failed:", error);
      },
    });
    this.selectedFile = null;
    this.fileInput.nativeElement.value = "";
  }

  clearFile() {
    this.selectedFile = null;
    this.fileInput.nativeElement.value = "";
  }

  checkForHIPAA(): void {
    if (!this.selectedFile) {
      window.alert("Please select a file to check for HIPAA compliance");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const textContent = reader.result as string;
      this.HIPAAService.checkForHIPAACompliance(textContent).subscribe({
        next: (complianceReport) => {
          if (complianceReport.containsSSN || complianceReport.containsCC) {
            this.isHIPAACompliant = true;
            window.alert(
              "The file is not HIPAA compliant. Please verify it before uploading.",
            );
          } else {
            this.isHIPAACompliant = false;
            window.alert(
              "The file is HIPAA compliant . You can proceed with the upload.",
            );
          }
        },
        error: (error: any) =>
          console.error("Error in HIPAA compliance check", error),
      });
    };
    reader.readAsText(this.selectedFile);
  }
}
