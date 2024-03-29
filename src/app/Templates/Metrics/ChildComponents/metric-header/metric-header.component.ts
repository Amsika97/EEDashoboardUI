import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-metric-header',
  templateUrl: './metric-header.component.html',
  styleUrls: ['./metric-header.component.css'],
})
export class MetricHeaderComponent {
  @Input() flowInforData: any;
  @Input() headingLabels: any;
}
