import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-reviewer-details',
  templateUrl: './reviewer-details.component.html',
  styleUrls: ['./reviewer-details.component.css'],
})
export class ReviewerDetailsComponent {
  @Input() flowInforData: any;
  @Input() categoryList: any;

  createInititals(str: string): string {
    let initials = '';
    str.split(' ').forEach((val) => {
      initials += val.charAt(0).toUpperCase();
    });
    return initials;
  }
}
