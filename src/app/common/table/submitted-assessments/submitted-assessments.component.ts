import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { assessment } from '../../../constants/savedAssessmentLabels';
import { HTTPService } from 'src/app/service/http.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { PageHeadingService } from 'src/app/service/pageHeader.service';

@Component({
  selector: 'app-submitted-assessments',
  templateUrl: './submitted-assessments.component.html',
  styleUrls: ['./submitted-assessments.component.css'],
})
export class SubmittedAssessmentsComponent implements OnInit {
  label: any;
  assessments: MatTableDataSource<any>;
  @Input() reviewer: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'srNo',
    'projectName',
    'reviewerName',
    'submittedOn',
    'preview',
  ];

  constructor(
    private service: HTTPService,
    private router: Router,
    private _liveAnnouncer: LiveAnnouncer,
    private pageHeadingService: PageHeadingService
  ) {
    this.label = assessment;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ngAfterViewInit() {
    // this.assessments.sort = this.sort;
  }

  getAllSubmittedAssessments() {
    this.service
      .httpRequest(
        '/ee-dashboard/api/v1/assessment/submittedBy/56/SUBMITTED',
        'GET',
        ''
      )
      .subscribe({
        next: (assessmentResponse: any) => {
          assessmentResponse.map((obj: any, index: number) => {
            obj.srNo = index + 1;
          });
          this.assessments = new MatTableDataSource(assessmentResponse);
          this.assessments.sort = this.sort;
          this.assessments.paginator = this.paginator;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  viewAssessment(id: number) {
    if (this.reviewer) {
      this.router.navigate(['/assessment-template'], {
        queryParams: { questionView: id, reviewer: this.reviewer },
      });
    } else {
      this.router.navigate(['/assessment-template'], {
        queryParams: { questionView: id },
      });
    }
  }

  ngOnInit(): void {
    this.pageHeadingService.setPageTitle({
      display: true,
      heading: 'Submitted Assessment',
    });
    this.getAllSubmittedAssessments();
  }
}
