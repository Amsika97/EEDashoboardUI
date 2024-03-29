import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { assessment } from 'src/app/constants/savedAssessmentLabels';
import { HTTPService } from 'src/app/service/http.service';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { AssessmentControllerURL } from 'src/app/apis/apiurls';
import { AzureService } from 'src/app/service/azureAuth.service';
import { headings } from '../../../constants/Labeles';
import { PageHeadingService } from 'src/app/service/pageHeader.service';
import { Title } from '@angular/platform-browser';
import { TemplatePopupComponent } from '../../TemplatePopup/TemplatePopup.component';

@Component({
  selector: 'app-reviewed-assessment',
  templateUrl: './reviewed-assessment.component.html',
  styleUrls: ['./reviewed-assessment.component.css', '../table-style.css'],
})
export class ReviewedAssessmentComponent implements OnInit, AfterViewInit {
  label: any;
  assessments: MatTableDataSource<any[]>;
  tableInfoData = [];
  isDataAvailable: boolean = false;
  headingLabels: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'projectCode',
    'projectName',
    'accountName',
    'templateName',
    'submittedDate',
    'reviewedOn',
    'reviewerName',
    'status',
    'score',
    'action',
  ];

  ssoUserInfo = {
    name: '',
    role: '',
    username: '',
    idTokenClaims: {
      oid: '',
    },
  };

  constructor(
    private service: HTTPService,
    private http: HttpClient,
    private router: Router,
    private _liveAnnouncer: LiveAnnouncer,
    private azureService: AzureService,
    private pageHeadingService: PageHeadingService,
    private titleService: Title,
    public dialog: MatDialog
  ) {
    this.label = assessment;
    this.headingLabels = headings;
    this.titleService.setTitle('Assessments');
  }

  ngOnInit(): void {
    this.pageHeadingService.setPageTitle({
      display: true,
      heading: 'Assessments',
      subHeading: this.headingLabels.assessmentSubHeading,
    });

    this.azureService.userSubject.subscribe((data) => {
      this.getAllAssessments(data.idTokenClaims.oid);
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
    this.getAllAssessments(this.ssoUserInfo.idTokenClaims.oid);
  }

  searchValue(searchString: string) {
    const searchResults = deepCopy(this.tableInfoData).filter((obj: any) => {
      return !!obj.reviewerName
        ? obj.reviewerName.toLowerCase().includes(searchString.toLowerCase())
        : false;
    });

    this.assessments = new MatTableDataSource<any[]>(searchResults);
    this.assessments.sort = this.sort;
    this.assessments.paginator = this.paginator;
  }

  clearValue() {
    this.assessments = new MatTableDataSource<any[]>(this.tableInfoData);
    this.assessments.sort = this.sort;
    this.assessments.paginator = this.paginator;
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

  getAllAssessments(obId: string) {
    this.service
      .httpRequest(AssessmentControllerURL.getAllAssessments + obId, 'GET')
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
          this.tableInfoData = assessmentResponse;
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
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

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
          type: 'assessment',
          dataObj: assessment,
        },
      });
    }
  }

  buttonCallBackFun() {
    this.router.navigate(['dashboard/assessments/take-assessment']);
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

  navigateUserProfile(objectId: String) {
    if (objectId != null) {
      this.router.navigate([`/dashboard/profile/user/${objectId}`]);
    } else {
      console.log('objectId is null.');
    }
  }
}
