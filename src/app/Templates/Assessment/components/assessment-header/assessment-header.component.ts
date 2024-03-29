import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-assessment-header',
  templateUrl: './assessment-header.component.html',
  styleUrls: ['./assessment-header.component.css'],
})
export class AssessmentHeaderComponent {
  @Input() flowInforData: any;
  @Input() headingLabels: any;
}
