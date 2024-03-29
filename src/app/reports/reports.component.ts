import { Component, OnInit } from '@angular/core';
import { PageHeadingService } from '../service/pageHeader.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  constructor(
    private pageHeadingService: PageHeadingService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Reports');
  }

  ngOnInit(): void {
    this.pageHeadingService.setPageTitle({
      display: true,
      heading: 'Reports',
      subHeading:
        'View reports related to assessment & metric submissions across the projects',
    });
  }
}
