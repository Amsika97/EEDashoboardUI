import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-userDetail-popup',
  templateUrl: './UserDetailPopup.component.html',
  styleUrls: ['./UserDetailPopup.component.css'],
})
export class UserDetailPopupComponent {
  groups: any = [
    {
      name: 'Manoj Viswanathan',
      role: 'Admin',
      userName: 'manojvi@maveric-systems.com',
      idTokenClaims: { oid: '0cda4d72-45ce-4817-b117-48eeb85fc64d' },
    },
    {
      name: 'Manoj Ramnarayan Yadav',
      role: 'Admin',
      userName: 'manojy@maveric-systems.com',
      idTokenClaims: { oid: '5d7cf233-1e1e-4e4d-88e6-c49c5c6a1311' },
    },
    {
      name: 'Baranidharan D',
      role: 'Reviewer',
      userName: 'baranidharand@maveric-systems.com',
      idTokenClaims: { oid: 'a1c48093-d8ea-4986-9a53-edee52b69008' },
    },
    {
      name: 'Arsuda Ravi Bhanjibhai',
      role: 'Reviewer',
      userName: 'arsudab@maveric-systems.com',
      idTokenClaims: { oid: '35c8963d-06a3-4219-9bcd-f3674ae7ae12' },
    },
    {
      name: 'Shantanu Balabhau Belankar',
      role: 'User',
      userName: 'shantanub@maveric-systems.com',
      idTokenClaims: { oid: '7e2313c6-1c9f-472a-a92d-76f165e08bd3' },
    },
    {
      name: 'Sutej Sitaram Pise',
      role: 'User',
      userName: 'sutejs@maveric-systems.com',
      idTokenClaims: { oid: '92e9383e-1ca0-4165-b21a-8c424471ac1a' },
    },
  ];
  constructor(
    public dialogRef: MatDialogRef<UserDetailPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
