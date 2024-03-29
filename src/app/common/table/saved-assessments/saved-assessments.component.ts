import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NonNullAssert } from '@angular/compiler';
import { Router } from '@angular/router';
import { assessment } from '../../../constants/savedAssessmentLabels';
import { DashboardService } from 'src/app/service/dashboard.service';
import { HTTPService } from 'src/app/service/http.service';
import { PaginationComponent } from 'src/app/common/pagination/pagination.component';
import { PaginationInstance } from 'ngx-pagination';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { PageHeadingService } from 'src/app/service/pageHeader.service';

@Component({
  selector: 'app-saved-assessments',
  templateUrl: './saved-assessments.component.html',
  styleUrls: ['./saved-assessments.component.css'],
})
export class SavedAssessmentsComponent implements OnInit {
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
    'action',
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

  projectPhase: [] = [];
  projects: any;
  data: any;
  date = new Date();
  projectName: any;

  getAllAssessments() {
    this.service
      .httpRequest('/ee-dashboard/api/v1/assessment/submittedBy/56/SAVE', 'GET')
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

  editCatagory(id: number) {
    // this.router.navigate(['/assessment-template'], {
    //   queryParams: { questionEdit: id },
    // });

    this.router.navigate(['/assessment-template'], {
      queryParams: { questionEdit: id },
    });
  }

  ngOnInit() {
    this.pageHeadingService.setPageTitle({
      display: true,
      heading: 'Saved Assessment',
    });
    this.getAllAssessments();
  }
}
