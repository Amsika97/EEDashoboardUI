import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { assessment } from '../../constants/savedAssessmentLabels';
import { HTTPService } from 'src/app/service/http.service';
import { Router } from '@angular/router';
import { headings } from '../../constants/Labeles';
import { PageHeadingService } from 'src/app/service/pageHeader.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pending-assessments-review',
  templateUrl: './pending-assessments-review.component.html',
  styleUrls: [
    './pending-assessments-review.component.css',
    '../../common/table/table-style.css',
  ],
})
export class PendingAssessmentsReviewComponent {
  label: any;
  headingLabels: any;

  constructor(
    private service: HTTPService,
    private router: Router,
    private pageHeadingService: PageHeadingService,
    private titleService: Title
  ) {
    this.label = assessment;
    this.headingLabels = headings;
    this.titleService.setTitle('Review Assessments & Metrics');
  }

  ngOnInit(): void {
    this.pageHeadingService.setPageTitle({
      display: true,
      heading: 'Reviews',
      subHeading: this.headingLabels.reviewsSubHeading,
    });
  }
}
