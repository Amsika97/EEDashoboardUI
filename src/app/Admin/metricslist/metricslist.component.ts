import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { assessmentmetricslist } from '../../constants/savedAssessmentLabels';
import { MatDialog } from '@angular/material/dialog';
import { HTTPService } from 'src/app/service/http.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TemplatePreviewPopup } from 'src/app/common/TemplatePreviewPopup/TemplatePreviewPopup.component';
export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

@Component({
  selector: 'app-metricslist',
  templateUrl: './metricslist.component.html',
  styleUrls: [
    './metricslist.component.css',
    '../../common/table/table-style.css',
  ],
})
export class MetricslistComponent implements OnInit {
  label: any;
  metricsassessments: MatTableDataSource<any>;
  assessmentData: any;

  @Input() reviewer: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'templateName',
    'templateDisplayName',
    'projectType',
    'createdBy',
    'createdOn',
    'templateFrequency',
    'toggleAction',
    'action',
  ];

  constructor(
    private service: HTTPService,
    private router: Router,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog
  ) {
    this.label = assessmentmetricslist;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ngAfterViewInit() {
    // this.metricsassessments.sort = this.sort;
  }

  getAllSubmittedMetrics() {
    this.service
      .httpRequest('/ee-dashboard/api/v1/metric/templates', 'GET', '')
      .subscribe({
        next: (metricsResponse: any) => {
          this.assessmentData = metricsResponse;
          this.metricsassessments = new MatTableDataSource(metricsResponse);
          this.metricsassessments.sort = this.sort;
          this.metricsassessments.paginator = this.paginator;

          this.metricsassessments.sortingDataAccessor = (
            item: any,
            property: any
          ) => {
            switch (property) {
              case 'createdOn':
                return new Date(item.createdOn);
              default:
                return item[property];
            }
          };
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  EenableDisable(event: any, templateId: string) {
    this.assessmentData.find((tempObj: any) => {
      return tempObj.templateId === templateId;
    }).isActive = event.checked;

    this.metricsassessments = new MatTableDataSource(this.assessmentData);
    this.metricsassessments.sort = this.sort;
    this.metricsassessments.paginator = this.paginator;

    this.service
      .httpRequest(
        `/ee-dashboard/api/v1/metric/template/updateMetricTemplateStatus/${templateId}?isActive=${event.checked}`,
        'PUT',
        ''
      )
      .subscribe({
        next: (metricsResponse: any) => {},
      });
  }

  ngOnInit(): void {
    this.getAllSubmittedMetrics();
  }

  getMoreInformation(metricsArr: any[]) {
    return metricsArr.join('\n');
  }

  preview(id: number) {
    // this.router.navigate(['dashboard/templateselection/metrics-template'], {
    //   queryParams: { questionView: id, templatePreview: true },
    // });
    const dialogRef = this.dialog.open(TemplatePreviewPopup, {
      height: '90%',
      width: '100%',
      maxWidth: '90vw',
      data: {
        type: 'metric',
        dataObj: { id, questionView: id, templatePreview: true },
      },
    });
  }
}
