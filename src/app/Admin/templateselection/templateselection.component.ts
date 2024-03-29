import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PageHeadingService } from 'src/app/service/pageHeader.service';
import { headings } from '../../constants/Labeles';
@Component({
  selector: 'app-templateselection',
  templateUrl: './templateselection.component.html',
  styleUrls: [
    './templateselection.component.css',
    '../../common/table/table-style.css',
  ],
})
export class TemplateselectionComponent implements OnInit {

  headingLabels:any;

  constructor(
    private router: Router,
    private titleService: Title,
    private pageHeadingService: PageHeadingService,
  ) {
    this.titleService.setTitle('Templates');
      this.headingLabels = headings;
  }

  ngOnInit(): void {
    this.pageHeadingService.setPageTitle({
      display: true,
      heading: 'Templates',
      subHeading: 'Manage Templates',
    });
  }

  buttonCallBackFun(event: any) {
    if (event.target.innerText === '+ ADD TEMPLATE') {
      this.router.navigate(['dashboard/template-selection/add-metric']);
    }
  }
  buttonCallBackFunAss(event: any) {
    if (event.target.innerText === '+ ADD TEMPLATE') {
      this.router.navigate(['dashboard/template-selection/add-templates']);
    }
  }
}
