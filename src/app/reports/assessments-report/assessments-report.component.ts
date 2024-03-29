import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { assessment } from 'src/app/constants/savedAssessmentLabels';
import { HTTPService } from 'src/app/service/http.service';
import { AssessmentControllerURL } from 'src/app/apis/apiurls';
import { TemplatePopupComponent } from 'src/app/common/TemplatePopup/TemplatePopup.component';
import { FilterPopupComponent } from 'src/app/common/filter-popup/filter-popup.component';
import { ConsentPopupComponent } from 'src/app/common/consentPopup/consentPopup.component';
import { AzureService } from 'src/app/service/azureAuth.service';
import { ValidationService } from 'src/app/service/validation.service';
@Component({
  selector: 'app-assessments-report',
  templateUrl: './assessments-report.component.html',
  styleUrls: [
    './assessments-report.component.css',
    '../../common/table/table-style.css',
  ],
})
export class AssessmentsReportComponent implements OnInit, AfterViewInit {
  label: any;
  assessments: MatTableDataSource<any[]>;
  tableInfoData = [];
  role: any;
  assessmentResponse1:any
  isDataAvailable: boolean = false;
  reportValues: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'srNo',
    'projectCode',
    'projectName',
    'accountName',
    'templateName',
    'submittedDate',
    'reviewerName',
    'submittedBy',
    'score',
    'status',
    'action',
  ];

  constructor(
    private service: HTTPService,
    private router: Router,
    private userDetailsService: AzureService,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private validationService: ValidationService
  ) {
    this.label = assessment;
  }

  ngOnInit(): void {
    this.service
        .httpRequest(AssessmentControllerURL.assessmentsReport, 'GET')
        .subscribe({
          next: (assessmentResponse: any) => {
            this.assessmentResponse1 = assessmentResponse;
            this.getAssessmentsReports(assessmentResponse);
          },
          error: (error) => {
            console.log(error);
          },
        });
    this.userDetailsService.userSubject.subscribe((data) => {
      this.role = data.role;
      this.getAssessmentsReports(this.assessmentResponse1)
    });
    const user: any = this.userDetailsService.getUserDetails();
    this.role = user.role;
    if (this.role) {
      this.getAssessmentsReports(this.assessmentResponse1);
    }
    this.validationService.reportsFilter.subscribe((assessmentResponse) => {
      this.reportValues = assessmentResponse.assessmentReportDetails;
      this.getAssessmentsReports(this.reportValues);
    });
  }

  ngAfterViewInit() {
    this.assessments.sort = this.sort;
    this.assessments.paginator = this.paginator;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  deletePopUp(id: any) {
    const dialogRef = this.dialog.open(ConsentPopupComponent, {
      data: {
        name: 'Are you sure you want to delete?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.service
          .httpRequest(
            `/ee-dashboard/api/v1/assessment/submitStatus/${id}`,
            'PUT'
          )
          .subscribe({
            next: (resp) => {
              console.log('soft deleted');
            },
            error: (err) => {
              console.log('api failed error', err);
            },
            complete: () => {
              this.service
                .httpRequest(AssessmentControllerURL.assessmentsReport, 'GET')
                .subscribe({
                  next: (assessmentResponse: any) => {
                    assessmentResponse = assessmentResponse;
                    this.getAssessmentsReports(assessmentResponse);
                  },
                  error: (error) => {
                    console.log(error);
                  },
                });
            },
        });
      }
    });
  }

  getAssessmentsReports(assessmentResponse: any) {
    console.log("assessment reports");
    
    if (assessmentResponse === null){
      this.isDataAvailable = false;
      this.assessments = new MatTableDataSource(assessmentResponse);
    }
    if (assessmentResponse && assessmentResponse.length > 0) {
      this.isDataAvailable = true;
      assessmentResponse.map((obj: any, index: number) => {
        obj.srNo = index + 1;
      });
    }
    this.tableInfoData = assessmentResponse;
    if (this.role !== 'Admin') {
      assessmentResponse = assessmentResponse.filter(
        (assessment: any) => assessment.status !== 'INACTIVE'
      );
    }
    this.assessments = new MatTableDataSource(assessmentResponse);
    this.assessments.sort = this.sort;
    this.assessments.paginator = this.paginator;
    this.assessments.sortingDataAccessor = (item: any, property: any) => {
      switch (property) {
        case 'submittedDate':
          return new Date(item.submittedAt);
        case 'reviewedOn':
          return new Date(item.reviewerAt);
        default:
          return item[property];
      }
    };
  }

  preview(id: number) {
    //open in a popup
    const dialogRef = this.dialog.open(TemplatePopupComponent, {
      height: '90%',
      width: '100%',
      maxWidth: '90vw',
      data: {
        type: 'assessment',
        dataObj: { id },
        browswerTitle: 'Reports',
      },
    });
  }

  getStatus(status: string) {
    if (status != null) {
      if (status === 'SAVE') {
        return 'SAVED';
      }
      else if(status === 'INACTIVE'){
        return 'DELETED'
      }
      return status;
    }
    return '---';
  }

  previewFilter() {
    const dialogRef = this.dialog.open(FilterPopupComponent, {
      height: '90%',
      width: '65%',
      maxWidth: '90vw',
    });
  }

  navigateUserProfile(objectId: String) {
    if (objectId != null) {
      this.router.navigate([`/dashboard/profile/user/${objectId}`]);
    } else {
      console.log('objectId is null.');
    }
  }
}
