import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TemplatePopupComponent } from 'src/app/common/TemplatePopup/TemplatePopup.component';
import { AssessmentServiceService } from 'src/app/service/assessment-service.service';

@Component({
  selector: 'app-metrics-history',
  templateUrl: './metrics-history.component.html',
  styleUrls: ['./metrics-history.component.css'],
})
export class MetricsHistoryComponent {
  @Input() metricList: any[] = [];
  @Input() metrics: MatTableDataSource<any[]>;
  displayedColumns: string[] = [
    'projectCode',
    'projectName',
    'accountName',
    'submittedAt',
    'score',
    'status',
    'action',
  ];

  constructor(
    private assessmentService: AssessmentServiceService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  preview(assessment: any) {
    if (assessment.status.toUpperCase() === 'SAVE') {
      this.router.navigate(['dashboard/assessments/assessment-template'], {
        queryParams: { questionView: assessment.id },
      });
    } else {
      //open in a popup
      const dialogRef = this.dialog.open(TemplatePopupComponent, {
        height: '90%',
        width: '100%',
        maxWidth: '90vw',
        data: {
          type: 'metric',
          dataObj: assessment,
        },
      });
    }
  }
}
