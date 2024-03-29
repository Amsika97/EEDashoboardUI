import { Component, Input, SimpleChanges } from '@angular/core';
import { AzureService } from 'src/app/service/azureAuth.service';

@Component({
  selector: 'app-my-activity',
  templateUrl: './my-activity.component.html',
  styleUrls: ['./my-activity.component.css'],
})
export class MyActivityComponent {
  @Input() metricStatusCounts: any;
  @Input() assessmentStatusCounts: any;
  @Input() name: string;
  @Input() emailId: string;
  @Input() accountProjectInfo: string[] = [];
  @Input() profileType: string;

  displayedColumns: string[] = ['drafts', 'submissions', 'reviewed'];
  employeeId: string;
  designation: string;
}
