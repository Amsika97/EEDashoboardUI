import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { assessment } from 'src/app/constants/savedAssessmentLabels';
import { HTTPService } from 'src/app/service/http.service';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { AssessmentControllerURL } from '../apis/apiurls';
import { AzureService } from '../service/azureAuth.service';
import { headings } from '../../app/constants/Labeles';
import { PageHeadingService } from '../service/pageHeader.service';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { TemplatePopupComponent } from './../common/TemplatePopup/TemplatePopup.component';

@Component({
  selector: 'app-metrics',
  templateUrl: './Metrics.component.html',
  styleUrls: ['./Metrics.component.css', '../common/table/table-style.css'],
})
export class MetricsComponent {
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
    this.titleService.setTitle('Metrics');
  }

  ngOnInit(): void {
    this.pageHeadingService.setPageTitle({
      display: true,
      heading: 'Metrics',
      subHeading: this.headingLabels.metricsSubHeading,
    });
    this.azureService.userSubject.subscribe((data) => {
      console.log('=====>', data);
      this.getAllMetricAssessments(data.idTokenClaims.oid);
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
    this.getAllMetricAssessments(this.ssoUserInfo.idTokenClaims.oid);
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

  getAllMetricAssessments(obId: string) {
    this.service
      .httpRequest(AssessmentControllerURL.getAllMetrics + obId, 'GET')
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

  preview(id: number, status: string) {
    status = status.toUpperCase();
    // if (status === 'APPROVED' || status === 'REJECTED') {
    //   this.router.navigate(['dashboard/metrics/metrics-template'], {
    //     queryParams: { questionView: id },
    //   });
    // }
    if (status === 'SAVE') {
      this.router.navigate(['dashboard/metrics/metrics-template'], {
        queryParams: { questionEdit: id },
      });
    } else {
      //open in a popup
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
    // if (status === 'SUBMITTED') {
    //   this.router.navigate(['dashboard/metrics/metrics-template'], {
    //     queryParams: { questionView: id },
    //   });
    // }
  }

  buttonCallBackFun() {
    this.router.navigate(['dashboard/metrics/submit-metric']);
  }

  getStatus(status: string) {
    if (status != null) {
      if (status === 'SAVE') {
        return 'SAVED';
      }
      else if (status === 'INACTIVE'){
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
