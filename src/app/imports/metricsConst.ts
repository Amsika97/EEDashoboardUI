import { MetricsComponent } from '../Metrics/MetricsComponent';
import { SubmitMetricsComponent } from '../Metrics/submit-metrics/SubmitMetricsComponent';

import { MetricsTemplateComponent } from '../Templates/Metrics/MetricsTemplateComponent';
import { RadioComponent } from '../Templates/Metrics/components/Radio/RadioComponent';
import { CheckBoxComponent } from '../Templates/Metrics/components/CheckBox/CheckBoxComponent';
import { DropDownComponent } from '../Templates/Metrics/components/Dropdown/DropDownComponent';
import { TextAreaComponent } from '../Templates/Metrics/components/TextArea/TextAreaComponent';
import { RangeComponent } from '../Templates/Metrics/components/Range/RangeComponent';
import { MetricsTableComponent } from '../common/table/metrics-table/metrics-table.component';
import { PendingMetricsComponent } from '../Reviewer/pending-assessments-review/pending-metrics/pending-metrics.component';
import { MetricsReportComponent } from '../reports/metrics-report/metrics-report.component';

export const matComponents = [
  MetricsComponent,
  SubmitMetricsComponent,
  MetricsTemplateComponent,
  RadioComponent,
  CheckBoxComponent,
  DropDownComponent,
  TextAreaComponent,
  RangeComponent,
  MetricsTableComponent,
  PendingMetricsComponent,
  MetricsReportComponent
];
