import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-template-popup-preview',
  templateUrl: './TemplatePreviewPopup.component.html',
  styleUrls: ['./TemplatePreviewPopup.component.css'],
})
export class TemplatePreviewPopup {
  constructor(
    public dialogRef: MatDialogRef<TemplatePreviewPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  fetchedData: any = {
    flowInforData: '',
    headingLabels: '',
    categoryList: '',
    projectName: '',
    businessUnitName: '',
    accountName: '',
    selectedStep: '',
  };

  onNoClick(): void {
    this.dialogRef.close();
  }

  popupAssessmentGetDetails($event: any) {
    this.fetchedData = { ...$event };
  }
  popupMetricsGetDetails($event: any) {
    this.fetchedData = { ...$event };
  }
}
