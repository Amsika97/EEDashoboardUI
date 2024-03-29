import { Component, ElementRef, Renderer2 } from '@angular/core';
import { AzureService } from 'src/app/service/azureAuth.service';
import { sidebar } from '../../constants/dashboardLabels';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
interface SidebarLabels {
  dashboard: string;
  assessment: string;
  metrics: string;
  templates: string;
  reviewassessmets: string;
  user: string;
  profile: string;
  reports: string;
  settings: string;
  help: string;
  faq: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  label: SidebarLabels;
  openCheck: boolean = false;
  role: string = '';
  isTemplate: boolean = false;
  isReports: boolean = false;
  isAssessment: boolean = false;
  reviewAssessments: boolean = false;
  isMetrics: boolean = false;
  isDashboard: boolean = false;
  pdfPath='../../../assets/pdf/EE-Dahboard-Userguide.pdf'

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private userDetailsService: AzureService,
    private router: Router
  ) {
    this.label = sidebar;
    this.router.events.subscribe((param) => {
      this.isDashboard =
        window.location.href.endsWith('dashboard');
    });
    this.router.events.subscribe((param) => {
      this.isTemplate =
        window.location.href.includes('template-selection') ||
        window.location.href.includes('add-template') ||
        window.location.href.includes('addmeteics');
    });
    this.router.events.subscribe((param) => {
      this.isAssessment =
        (window.location.pathname === '/dashboard/assessments' ||
        window.location.href.includes('take-assessment') ||
        window.location.href.includes('assessment-template')) && 
        !window.location.href.includes('reviewer=true') && 
        !window.location.href.includes('reportsFlow=true') &&
        !window.location.href.includes('templatePreview=true');
    });
    this.router.events.subscribe((param) => {
      this.isMetrics  =
        (window.location.href.includes('metric') || 
        window.location.href.includes('submit-metric')) && 
        !window.location.href.includes('reviewer=true') && 
        !window.location.href.includes('reportsFlow=true') &&
        !window.location.href.includes('templatePreview=true')
    });
    this.router.events.subscribe((param) => {
      this.reviewAssessments =
        window.location.href.includes('review-assessments') || 
        window.location.href.includes('reviewer=true')
    });
    this.router.events.subscribe((param) => {
      this.isReports =
        window.location.href.includes('reports');
    });
  }

  ngOnInit(): void {
    this.userDetailsService.userSubject.subscribe((data) => {
      this.role = data.role;
    });
    const user:any = this.userDetailsService.getUserDetails();
    this.role = user.role;
  }
  userGuide(){
    const pdf = 'src/app/common/sidebar/spring-core-v2.pdf'
    window.open(pdf,"_blank")
  }
  openNav() {
    this.openCheck = false;
    const sideNav = this.elementRef.nativeElement.querySelector('#mySidenav');
    const main = this.elementRef.nativeElement.querySelector('#main');
    if (window.innerWidth <= 768) {
      this.renderer.setStyle(main, 'marginLeft', '0px');
      this.renderer.setStyle(sideNav, 'width', '250px');
    } else {
      this.renderer.setStyle(main, 'marginLeft', '250px');
      this.renderer.setStyle(sideNav, 'width', '250px');
    }
  }

  closeNav() {
    this.openCheck = true;
    const sideNav = this.elementRef.nativeElement.querySelector('#mySidenav');
    const main = this.elementRef.nativeElement.querySelector('#main');
    this.renderer.setStyle(main, 'marginLeft', '0');
    this.renderer.setStyle(sideNav, 'width', '0');
  }
}
