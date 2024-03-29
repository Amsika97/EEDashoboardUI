import { Component } from '@angular/core';
import { ConsentPopupComponent } from 'src/app/common/consentPopup/consentPopup.component';
import { ConfirmationPopupComponent } from 'src/app/common/ConfirmationPopup/ConfirmationPopup.component';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-test-comp',
  templateUrl: './Test.component.html',
  styleUrls: ['./Test.component.css'],
})
export class TestComp {
  heading: string = 'Are you sure you want to save assessment?';
  popupResponse: any;
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ConsentPopupComponent, {
      data: { name: this.heading },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //if result is yes make a API call
      this.popupResponse = result;
    });
  }

  //========================confirmation popup===========
  confirmationHeading: string = 'Saved Successfully!';
  confirmationSubHeading: string =
    'Your Assessment have been saved Successfully.';
  popupConResponse: any;
  openDialogConfirmation(): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      data: {
        status: 'success',
        heading: this.confirmationHeading,
        subHeading: this.confirmationSubHeading,
        buttonText: 'BACK HOME',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //if result is yes go for router navigation
      this.popupConResponse = result;
    });
  }
}
