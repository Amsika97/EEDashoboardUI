import { Component } from '@angular/core';
import { PageHeadingService } from '../service/pageHeader.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentServiceService } from '../service/assessment-service.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  profileType: string;
  // objectId = '7e2313c6-1c9f-472a-a92d-76f165e08bd3';
  assessmentList: any[] = [];
  metricList: any[] = [];
  assessments: MatTableDataSource<any[]>;
  metrics: MatTableDataSource<any[]>;
  draftCount = 0;
  reviewedCount = 0;
  submittedCount = 0;
  objectId: any;
  assessmentStatusCounts: any;
  metricStatusCounts: any;
  userName: any;
  emailAddress: any;
  combinedData: string[] = [];
  mergedData: string[] = [];
  accountProjectInfo: string[] = [];

  constructor(
    private pageHeadingService: PageHeadingService,
    private titleService: Title,
    private route: ActivatedRoute,
    private assessmentService: AssessmentServiceService,
    private router: Router
  ) {
    this.titleService.setTitle('Profile');
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    this.route.params.subscribe((params) => {
      this.profileType = params['profile'];
      this.objectId = params['objectId'];
    });
    this.route.queryParams.subscribe((params) => {
      const objectId = params['objectId'];
    });

    if (this.profileType == 'user') {
      this.pageHeadingService.setPageTitle({
        display: true,
        heading: 'User Profile',
        subHeading: 'View profile related to account',
      });
    } else {
      this.pageHeadingService.setPageTitle({
        display: true,
        heading: 'My Profile',
        subHeading: 'View profile related to account',
      });
    }

    this.fetchAssessmentList();
  }

  fetchAssessmentList(): void {
    this.assessmentService
      .getAssessmentList(this.objectId, this.profileType)
      ?.subscribe(
        (data: any) => {
          this.userName = data.userDto?.name;
          this.emailAddress = data.userDto?.emailAddress;
          this.assessmentList = data?.assessmentlist;
          this.metricList = data?.matricsubmitlist;
          this.assessments = new MatTableDataSource(data?.assessmentlist);
          this.metrics = new MatTableDataSource(data?.matricsubmitlist);

          // Calculate counts for assessments
          this.assessmentStatusCounts = this.calculateStatusCounts(
            this.assessmentList
          );

          // Calculate counts for metrics
          this.metricStatusCounts = this.calculateStatusCounts(this.metricList);
          this.extractAndCombineData(this.assessmentList);
          this.extractAndCombineData(this.metricList);
          console.log(
            'assessment count -->' +
              JSON.stringify(this.assessmentStatusCounts),
            'metric count -->' + JSON.stringify(this.metricStatusCounts)
          );
        },
        (error) => {
          console.error('Error fetching assessment list:', error);
        }
      );
  }

  calculateStatusCounts(data: any[]): {
    draft: number;
    reviewed: number;
    submitted: number;
  } {
    this.draftCount = 0;
    this.reviewedCount = 0;
    this.submittedCount = 0;

    data?.forEach((item) => {
      switch (item.status) {
        case 'SAVE':
          this.draftCount++;
          break;
        // case 'SUBMITTED' :
        //   this.submittedCount++;
        //   break;
        // case 'REVIEWED' :
        //   this.reviewedCount++;
        //   break;
        default:
          break;
      }
      if (this.objectId == item.reviewerId && item.status != 'SAVE') {
        this.reviewedCount++;
      }
      if (this.objectId == item.submittedBy && item.status != 'SAVE') {
        this.submittedCount++;
      }
    });

    return {
      draft: this.draftCount,
      reviewed: this.reviewedCount,
      submitted: this.submittedCount,
    };
  }

  extractAndCombineData(assessmentList: any[]): void {
    if (this.assessmentList && this.assessmentList.length > 0) {
      this.combinedData = this.assessmentList.map((item: any) => {
        const account = item.accountName;
        const project = item.projectName;
        return `${account}/${project}`;
      });
    }
    if (this.metricList && this.metricList.length > 0) {
      this.mergedData = this.metricList.map((item: any) => {
        const account = item.accountName;
        const project = item.projectName;
        return `${account}/${project}`;
      });
    }
    this.accountProjectInfo = Array.from(
      new Set([...this.combinedData, ...this.mergedData])
    );
  }
}
