import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { assessment } from '../../../constants/savedAssessmentLabels';
import { HTTPService } from 'src/app/service/http.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ReviewerURL } from '../../apis/apiurls';
import { AzureService } from 'src/app/service/azureAuth.service';
import { MatDialog } from '@angular/material/dialog';
import { TemplatePopupComponent } from 'src/app/common/TemplatePopup/TemplatePopup.component';

@Component({
  selector: 'app-pending-metrics',
  templateUrl: './pending-metrics.component.html',
  styleUrls: [
    './pending-metrics.component.css',
    '../../../common/table/table-style.css',
  ],
})
export class PendingMetricsComponent {
  label: any;
  assessments: MatTableDataSource<any>;
  reviewer: boolean = true;
  isDataAvailable: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentTab: any = 'PENDING';

  displayedColumns: string[] = [
    'srNo',
    'projectCode',
    'projectName',
    'accountName',
    'projectType',
    'submittedDate',
    'submittedBy',
    'score',
    'review',
  ];

  ssoUserInfo = {
    name: '',
    role: '',
    username: '',
    idTokenClaims: {
      oid: '',
    },
  };

  userObId: any;

  constructor(
    private service: HTTPService,
    private router: Router,
    private _liveAnnouncer: LiveAnnouncer,
    private azureService: AzureService,
    public dialog: MatDialog
  ) {
    this.label = assessment;
  }

  ngOnInit(): void {
    this.azureService.userSubject.subscribe((data) => {
      this.getAllPendingReviewMetrics(data.idTokenClaims.oid);
      this.userObId = data.idTokenClaims.oid;
    });

    const SSOData: any = this.azureService.getUserDetails();
    this.ssoUserInfo = {
      name: SSOData.name,
      role: SSOData.role,
      username: SSOData.username,
      idTokenClaims: {
        oid: SSOData.idTokenClaims.oid,
      },
    };
    this.userObId = SSOData.idTokenClaims.oid;
    this.getAllPendingReviewMetrics(this.ssoUserInfo.idTokenClaims.oid);
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

  buttonCallBackPendingReviewMetrics() {
    let index = this.displayedColumns.indexOf('status');
    if (index !== -1) {
      this.displayedColumns.splice(index, 1);
    }

    this.currentTab = 'PENDING';
    this.getAllPendingReviewMetrics(this.userObId);
  }

  buttonCallBackReviewedMetrics() {
    let index = this.displayedColumns.indexOf('submittedBy');

    if (index !== -1) {
      this.displayedColumns.splice(index + 1, 0, 'status');
    }

    this.currentTab = 'REVIEWED';
    this.getAllReviewedMetrics(this.userObId);
  }

  getAllPendingReviewMetrics(obId: string) {
    this.service
      .httpRequest(ReviewerURL.pendingMetricsReview + obId, 'GET')
      .subscribe({
        next: (assessmentResponse: any) => {
          if (assessmentResponse.hasOwnProperty('message'))
            this.isDataAvailable = false;
          if (assessmentResponse && assessmentResponse.length > 0) {
            this.isDataAvailable = true;
            assessmentResponse.map((obj: any, index: number) => {
              obj.srNo = index + 1;
            });
          }
          this.assessments = new MatTableDataSource(assessmentResponse);
          this.assessments.sort = this.sort;
          this.assessments.paginator = this.paginator;
          this.assessments.sortingDataAccessor = (item: any, property: any) => {
            switch (property) {
              case 'submittedDate':
                return new Date(item.submittedAt);
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

  getAllReviewedMetrics(obId: string) {
    this.service
      .httpRequest(ReviewerURL.getReviewedMetricsURL + obId, 'GET')
      .subscribe({
        next: (assessmentResponse: any) => {
          if (assessmentResponse.hasOwnProperty('message'))
            this.isDataAvailable = false;
          if (assessmentResponse && assessmentResponse.length > 0) {
            this.isDataAvailable = true;
            assessmentResponse.map((obj: any, index: number) => {
              obj.srNo = index + 1;
            });
          }
          this.assessments = new MatTableDataSource(assessmentResponse);
          this.assessments.sort = this.sort;
          this.assessments.paginator = this.paginator;
          this.assessments.sortingDataAccessor = (item: any, property: any) => {
            switch (property) {
              case 'submittedDate':
                return new Date(item.submittedAt);
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

  preview(id: number, status: string) {
    if (this.currentTab === 'PENDING') {
      this.router.navigate(['dashboard/review-assessments/metrics-template'], {
        queryParams: { questionView: id, reviewer: this.reviewer },
      });
    } else {
      const dialogRef = this.dialog.open(TemplatePopupComponent, {
        height: '90%',
        width: '100%',
        maxWidth: '90vw',
        data: {
          type: 'metric',
          dataObj: { id, status },
        },
      });
    }
  }

  navigateUserProfile(objectId: String) {
    if (objectId != null) {
      this.router.navigate([`/dashboard/profile/user/${objectId}`]);
    } else {
      console.log('objectId is null.');
    }
  }
}
