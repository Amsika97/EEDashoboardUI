import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeadingService } from 'src/app/service/pageHeader.service';

@Component({
  selector: 'page-navigation',
  templateUrl: './page-navigation.component.html',
  styleUrls: ['./page-navigation.component.css'],
})
export class PageNavigationComponent {
  constructor(
    private router: Router,
    private pageHeadingService: PageHeadingService
  ) {}
  public pageData = {
    heading: '',
    subHeading: '',
    display: true,
  };

  ngOnInit(): void {
    this.pageHeadingService.pageHeadingSubject.subscribe((data: any) => {
      this.pageData = data;
    });
  }

  // navigation() {
  //   this.router.navigateByUrl(this.routeURL);
  // }
}
