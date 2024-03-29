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
import { Subject, takeUntil } from 'rxjs';
import { TemplatePopupComponent } from 'src/app/common/TemplatePopup/TemplatePopup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pending-assessments',
  templateUrl: './pending-assessments.component.html',
  styleUrls: [
    './pending-assessments.component.css',
    '../../../common/table/table-style.css',
  ],
})
export class PendingAssessmentsComponent {
  label: any;
  assessments: MatTableDataSource<any>;
  reviewer: boolean = true;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isDataAvailable: boolean = false;
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

  private destroy$: Subject<void> = new Subject<void>();

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
      this.getAllPendingReviewAssessments(data.idTokenClaims.oid);
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
    this.getAllPendingReviewAssessments(this.ssoUserInfo.idTokenClaims.oid);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  getAllReviewedAssessments(obId: string) {
    this.service
      .httpRequest(ReviewerURL.getReviewedAssessmentURL + obId, 'GET')
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

  buttonCallBackReviewedAssessments() {
    let index = this.displayedColumns.indexOf('submittedBy');

    if (index !== -1) {
      this.displayedColumns.splice(index + 1, 0, 'status');
    }

    this.currentTab = 'REVIEWED';
    this.getAllReviewedAssessments(this.userObId);
  }

  buttonCallBackPendingReviewAssessments() {
    let index = this.displayedColumns.indexOf('status');
    if (index !== -1) {
      this.displayedColumns.splice(index, 1);
    }

    this.currentTab = 'PENDING';
    this.getAllPendingReviewAssessments(this.userObId);
  }

  getAllPendingReviewAssessments(obId: string) {
    this.service
      .httpRequest(ReviewerURL.pendingAssessmentsReview + obId, 'GET')
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

  preview(assessmentObj: any) {
    if (this.currentTab === 'PENDING') {
      this.router.navigate(
        ['dashboard/review-assessments/assessment-template'],
        {
          queryParams: {
            questionView: assessmentObj.id,
            reviewer: this.reviewer,
          },
        }
      );
    } else {
      const dialogRef = this.dialog.open(TemplatePopupComponent, {
        height: '90%',
        width: '100%',
        maxWidth: '90vw',
        data: {
          type: 'assessment',
          dataObj: assessmentObj,
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
