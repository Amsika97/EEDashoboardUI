import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-preview-popup',
  templateUrl: './PreviewPopup.component.html',
  styleUrls: ['./PreviewPopup.component.css'],
})
export class PreviewPopup {
  @ViewChild('scrollBody') elementView: ElementRef;

  fetchedData: any = {
    flowInforData: '',
    categoryList: '',
    disableQuestion: '',
    originalData: '',
    isSubmitted: '',
    assesmentId: '',
    popupData: '',
    respMsg: '',
  };
  contentHeight: number;

  constructor(
    public dialogRef: MatDialogRef<PreviewPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.fetchedData = { ...this.data };
  }

  ngAfterViewInit() {
    this.contentHeight = !!document.querySelector<HTMLElement>(
      '.popupBody .container__content'
    )
      ? document.querySelector<HTMLElement>('.popupBody .container__content')!
          .offsetHeight
      : 1;
  }
}
