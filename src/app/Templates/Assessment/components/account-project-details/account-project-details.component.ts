import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-account-project-details',
  templateUrl: './account-project-details.component.html',
  styleUrls: ['./account-project-details.component.css'],
})
export class AccountProjectDetailsComponent {
  @Input() flowInforData: any;
  @Input() categoryList: any;
  @Input() projectName: any;
  @Input() businessUnitName: any;
  @Input() accountName: any;
  @Input() selectedStep: any;
}
