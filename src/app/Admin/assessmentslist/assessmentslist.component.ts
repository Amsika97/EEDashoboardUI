import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { assessmenttemplateslist } from '../../constants/savedAssessmentLabels';
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
  selector: 'app-assessmentslist',
  templateUrl: './assessmentslist.component.html',
  styleUrls: [
    './assessmentslist.component.css',
    '../../common/table/table-style.css',
  ],
})
export class AssessmentslistComponent implements OnInit {
  label: any;
  templateassessments: MatTableDataSource<any>;
  assessmentData: any;
  count: any;

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
    this.label = assessmenttemplateslist;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ngAfterViewInit() {
    // this.templateassessments.sort = this.sort;
  }

  getAllSubmittedAssessments() {
    this.service
      .httpRequest('/ee-dashboard/api/v1/templates', 'GET', '')
      .subscribe({
        next: (assessmentResponse: any) => {
          this.assessmentData = assessmentResponse;
          this.templateassessments = new MatTableDataSource(assessmentResponse);
          this.templateassessments.sort = this.sort;
          this.templateassessments.paginator = this.paginator;

          this.templateassessments.sortingDataAccessor = (
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

    this.templateassessments = new MatTableDataSource(this.assessmentData);
    this.templateassessments.sort = this.sort;
    this.templateassessments.paginator = this.paginator;

    this.service
      .httpRequest(
        `/ee-dashboard/api/v1/template/discard/${templateId}?isActive=${event.checked}`,
        'PUT',
        ''
      )
      .subscribe({
        next: (metricsResponse: any) => {},
      });
  }

  ngOnInit(): void {
    this.getAllSubmittedAssessments();
  }

  getMoreInformation(AssessmentsArr: any[]) {
    return AssessmentsArr.join('\n');
  }

  preview(id: number) {
    // this.router.navigate(['dashboard/templateselection/assessment-template'], {
    //   queryParams: { questionView: id, templatePreview: true },
    // });
    //open in a popup
    const dialogRef = this.dialog.open(TemplatePreviewPopup, {
      height: '90%',
      width: '100%',
      maxWidth: '90vw',
      data: {
        type: 'assessment',
        dataObj: { id, questionView: id, templatePreview: true },
      },
    });
  }
}
