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

@Component({
  selector: 'app-metrics-table',
  templateUrl: './metrics-table.component.html',
  styleUrls: ['./metrics-table.component.css', '../table-style.css'],
})
export class MetricsTableComponent implements OnInit, AfterViewInit {
  label: any;
  assessments: MatTableDataSource<any[]>;
  tableInfoData = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'srNo',
    'projectName',
    'submittedBy',
    'lastUpdated',
    'reviewerName',
    'reviewedOn',
    'saved',
    'submitted',
    'reviewed',
    'action',
  ];

  constructor(
    private service: HTTPService,
    private http: HttpClient,
    private router: Router,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    this.label = assessment;
  }

  ngOnInit(): void {
    this.getAllReviewAssessments();
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
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getAllReviewAssessments() {
    this.service
      .httpRequest(
        // AssessmentControllerURL.reviewdAssessment,
        '/ee-dashboard/api/v1/assessment/submittedBy/56/SUBMITTED',
        // '/ee-dashboard/api/v1/assessment/assessmentStatusList?assessmentStatusList=APPROVED&assessmentStatusList=REJECTED&submittedBy=56',
        'GET'
      )
      .subscribe({
        next: (assessmentResponse: any) => {
          assessmentResponse = [];
          assessmentResponse = [
            {
              submitedBy: 56,
              assessmentId: 540817823,
              submitedAt: 1699855682316,
              projectId: 415749206,
              templateId: 563875408,
              clientName: 'citi',
              projectName: 'citi NAM citi NAM citi NAM',
              submitStatus: 'APPROVED',
              reviewerName: 'Abc',
              reviewerAt: 1699855682316,
            },
            {
              submitedBy: 56,
              assessmentId: 312266191,
              submitedAt: 1701085106479,
              projectId: 415749206,
              templateId: 412682619,
              clientName: 'citi',
              projectName: 'citi NAM',
              submitStatus: 'APPROVED',
              reviewerName: 'Akhil',
              reviewerAt: 1699855682316,
            },
            {
              submitedBy: 56,
              assessmentId: 312266191,
              submitedAt: 1701085106479,
              projectId: 415749206,
              templateId: 412682619,
              clientName: 'citi',
              projectName: 'citi NAM',
              submitStatus: 'REJECTED',
              reviewerName: 'nikhil',
              reviewerAt: 1699855682316,
            },
            {
              submitedBy: 56,
              assessmentId: 312266191,
              submitedAt: 1701085106478,
              projectId: 415749206,
              templateId: 412682619,
              clientName: 'citi',
              projectName: 'citi NAM',
              submitStatus: 'REJECTED',
              reviewerName: 'shantanu',
              reviewerAt: 1699855682306,
            },
          ];
          assessmentResponse.map((obj: any, index: number) => {
            obj.srNo = index + 1;
          });
          this.tableInfoData = assessmentResponse;
          this.assessments = new MatTableDataSource(assessmentResponse);
          this.assessments.sort = this.sort;
          this.assessments.paginator = this.paginator;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  preview(id: number) {
    this.router.navigate(['/assessment-template'], {
      queryParams: { questionView: id },
    });
  }

  buttonCallBackFun(event: any) {
    if (event.target.innerText === '+ TAKE ASSESSMENT') {
      this.router.navigate(['/assessment']);
    }
  }
}
