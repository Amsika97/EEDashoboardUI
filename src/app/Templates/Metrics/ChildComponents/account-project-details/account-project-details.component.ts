import { Component, Input } from '@angular/core';
import { HTTPService } from 'src/app/service/http.service';

@Component({
  selector: 'app-account-project-details-metric',
  templateUrl: './account-project-details.component.html',
  styleUrls: ['./account-project-details.component.css'],
})
export class AccountProjectDetailsMetricComponent {
  isSubmitted: any;
  constructor(private service: HTTPService) {
    this.isSubmitted = service.submittedBoolean;
  }
  @Input() flowInforData: any;
  @Input() categoryList: any;
  @Input() projectName: any;
  // @Input() businessUnitName: any;
  @Input() accountName: any;
  @Input() selectedStep: any;
}
