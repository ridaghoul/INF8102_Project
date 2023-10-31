import { Component } from '@angular/core';
import { S3DriveService } from './s3-drive.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private S3Drive: S3DriveService) {
    // Utiliser le service ici
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.S3Drive.uploadFile(file);
    }
  }

  title = 'S3Drive';
}
