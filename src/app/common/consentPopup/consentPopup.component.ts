import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-consent-popup',
  templateUrl: './consentPopup.component.html',
  styleUrls: ['./consentPopup.component.css'],
})
export class ConsentPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<ConsentPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
