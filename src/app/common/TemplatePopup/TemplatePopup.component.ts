import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-template-popup',
  templateUrl: './TemplatePopup.component.html',
  styleUrls: ['./TemplatePopup.component.css'],
})
export class TemplatePopupComponent {
  fetchedData: any = {
    flowInforData: '',
    headingLabels: '',
    categoryList: '',
    projectName: '',
    businessUnitName: '',
    accountName: '',
    selectedStep: '',
  };

  constructor(
    public dialogRef: MatDialogRef<TemplatePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

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
