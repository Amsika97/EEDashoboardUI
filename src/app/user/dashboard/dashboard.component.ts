import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { HTTPService } from '../../service/http.service';
import { MatDialog } from '@angular/material/dialog';
import { PageHeadingService } from 'src/app/service/pageHeader.service';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { PageComponentService } from 'src/app/service/pageComponentControll.service';
import { TemplatePopupComponent } from 'src/app/common/TemplatePopup/TemplatePopup.component';
import { MatIconRegistry } from '@angular/material/icon';
import { AzureService } from 'src/app/service/azureAuth.service';
import { Subject, debounce, debounceTime } from 'rxjs';
import { Apiurls } from '../apis/apiurls';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.css',
    '../../common/table/table-style.css',
  ],
})
export class DashboardComponent implements OnInit {
  accounts: any;
  accountReset: any;
  projectReset: any;
  projects: any;
  loadingData: boolean = true;
  isDataAvailable: boolean = false;
  selectedProjects: any[] = [];
  accountId: Subject<any> = new Subject();
  accountID: any;
  projectID: Subject<any[]> = new Subject();
  dashboard: any;
  dataSource: any[] = [];
  metricsData: any[] = [];
  userDetails: any;
  totalAssessments: number;
  preLoader: any;
  assessment: boolean = false;
  metric: boolean = true;

  displayedColumns: string[] = [
    'projectCode',
    'projectName',
    'accountName',
    'templateName',
    'submittedBy',
    'submittedOn',
    'reviewerName',
    'status',
    'score',
    'action',
  ];
  metricTableColumns: string[] = [
    'projectCode',
    'projectName',
    'accountName',
    'templateName',
    'submittedBy',
    'submittedOn',
    'reviewerName',
    'status',
    'score',
    'action',
  ];
  constructor(
    private service: HTTPService,
    private azureService: AzureService,
    private pageHeadingService: PageHeadingService,
    private titleService: Title,
    private pageComponentService: PageComponentService,
    public dialog: MatDialog,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.userDetails = JSON.parse(sessionStorage.getItem('userInfo') || 'null');
    this.titleService.setTitle('EE-Dashboard');

    iconRegistry.addSvgIcon(
      'preview',
      sanitizer.bypassSecurityTrustResourceUrl('assets/svg/Preview.svg')
    );
  }

  accountFilter(event: MatSelectChange) {
    this.accountID = event.value;
    this.selectedProjects = [];
    this.service.passFilterValue(this.accountID);
    this.service.passFilterValueForProject(null);
    this.allProjects();
    this.top10Assessments();
    this.top10Metrics();
    this.consolidatedAssessmentData();
  }
  projectFilter(event: MatSelectChange) {
    this.selectedProjects = event.value;
    this.service.passFilterValueForProject(this.selectedProjects);
    this.top10Assessments();
    this.top10Metrics();
    this.consolidatedAssessmentData();
  }

  consolidatedAssessmentData() {
    if (this.accountID || this.selectedProjects.length > 0) {
      const url =
        this.accountID && this.selectedProjects.length > 0
          ? `/ee-dashboard/api/v1/consolidated-assessmentsdata?fieldName=PR&fieldValue=${this.selectedProjects}`
          : `/ee-dashboard/api/v1/consolidated-assessmentsdata?fieldName=AC&fieldValue=${this.accountID}`;
      this.service.httpRequest(url, 'GET', '').subscribe(
        (data: any) => {
          if (!data.message) {
            this.dashboard = data;
          } else this.dashboard = [];
        },
        (error: Error) => {
          this.dashboard = '';
          console.log(error.message);
        }
      );
    } else {
      this.service
        .httpRequest(
          '/ee-dashboard/api/v1/consolidated-assessmentsdata',
          'GET',
          ''
        )
        .subscribe(
          (data) => {
            if (data !== undefined) {
              this.dashboard = data;
            }
          },
          (error: Error) => {
            console.log(error.message);
          }
        );
    }
  }

  allAccounts() {
    this.service.httpRequest(Apiurls.newAccountAPI, 'GET').subscribe((data) => {
      this.accounts = data;
    });
  }
  resetFilter() {
    this.accountID = '';
    this.accountReset = '';
    this.projectReset = '';
    this.projects = [];
    this.selectedProjects = [];
    this.service.passFilterValue(null);
    this.service.passFilterValueForProject(null);
    this.top10Assessments();
    this.top10Metrics();
    this.consolidatedAssessmentData();
  }
  allProjects() {
    this.projects = '';
    if (this.accountID) {
      this.service
        .httpRequest(Apiurls.projectByAccountId + this.accountID, 'GET')
        .subscribe((data) => {
          this.projects = data;
        });
    }
  }

  top10Assessments() {
    if (this.accountID || this.selectedProjects.length > 0) {
      const url =
        this.accountID && this.selectedProjects.length > 0
          ? `/ee-dashboard/api/v1/assessment/Top10Assessmentsfordashboard/Filters?filterName=PR&filterValue=${this.selectedProjects}`
          : `/ee-dashboard/api/v1/assessment/Top10Assessmentsfordashboard/Filters?filterName=AC&filterValue=${this.accountID}`;
      this.service.httpRequest(url, 'GET').subscribe(
        (data: any) => {
          //data.message ? this.isDataAvailable = false: this.isDataAvailable=false
          data.message !== 'Assessment not found'
            ? (this.dataSource = data?.sort((a: any, b: any) => {
                return b.score - a.score;
              }))
            : (this.dataSource = []);
        },
        (error: Error) => {
          console.log(error.message);
        }
      );
    } else {
      this.service
        .httpRequest(
          '/ee-dashboard/api/v1/assessment/Top10Assessmentsfordashboard',
          'GET'
        )
        .subscribe(
          (data: any) => {
            data.message !== 'Assessment not found'
              ? (this.dataSource = data?.sort((a: any, b: any) => {
                  return b.score - a.score;
                }))
              : (this.dataSource = []);
          },
          (error: Error) => {
            console.log(error.message);
          }
        );
    }
  }

  top10Metrics() {
    if (this.accountID || this.selectedProjects.length > 0) {
      const url =
        this.accountID &&
        this.selectedProjects.length > 0 &&
        this.selectedProjects !== null
          ? `/ee-dashboard/api/v1/metric/top10/dashboard/filters?filterName=PR&filterValue=${this.selectedProjects}`
          : `/ee-dashboard/api/v1/metric/top10/dashboard/filters?filterName=AC&filterValue=${this.accountID}`;
      this.service.httpRequest(url, 'GET').subscribe(
        (data: any) => {
          data.message !== 'Submitted Metric  not found'
            ? (this.metricsData = data?.sort((a: any, b: any) => {
                return b.score - a.score;
              }))
            : (this.metricsData = []);
        },

        (error) => console.log(error.message)
      );
    } else {
      this.service
        .httpRequest(
          '/ee-dashboard/api/v1/metric/Top10Metricfordashboard',
          'GET'
        )
        .subscribe(
          (data: any) => {
            !data.message
              ? (this.metricsData = data?.sort((a: any, b: any) => {
                  return b.score - a.score;
                }))
              : (this.metricsData = []);
          },

          (error) => console.log(error.message)
        );
    }
  }

  preview(type: string, id: number) {
    //open in a popup
    const dialogRef = this.dialog.open(TemplatePopupComponent, {
      height: '90%',
      width: '100%',
      maxWidth: '90vw',
      data: {
        type: type,
        dataObj: { id },
      },
    });
  }
  fetchData() {
    this.allAccounts();
    this.top10Assessments();
    this.top10Metrics();
  }

  ngOnInit() {
    this.pageComponentService.displayBreadCrumb(false);
    this.pageHeadingService.setPageTitle({
      display: true,
      heading: 'Engineering Excellence Dashboard',
      subHeading:
        'Welcome!  This application is intended to help understand & showcase engineering excellence of your project through assessments and metrics data.',
    });
    this.consolidatedAssessmentData();
    this.fetchData();
  }

  navigateUserProfile(objectId: String) {
    if (objectId != null) {
      this.router.navigate([`/dashboard/profile/user/${objectId}`]);
    } else {
      console.log('objectId is null.');
    }
  }
}
