import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { dashboard } from '../../constants/dashboardLabels';
import { Apiurls } from '../../user/apis/apiurls';
import { HTTPService } from 'src/app/service/http.service';
import { Businessunit } from 'src/app/model/businessunit';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { BreadcrumbService } from 'xng-breadcrumb';
import { headings } from '../../constants/Labeles';
import { PageHeadingService } from 'src/app/service/pageHeader.service';

interface DashboardLabels {
  account: string;
  projectLabel: string;
  projectTypeLabel: string;
  templateTypeLabel: string;
}
@Component({
  selector: 'app-submit-metrics',
  templateUrl: './SubmitMetrics.component.html',
  styleUrls: ['./SubmitMetrics.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class SubmitMetricsComponent implements OnInit {
  BusinessUnits: any;
  accounts: any;
  projects: any;
  templates: any;
  projectTypes: any;
  label: DashboardLabels;
  projectId: any;
  accountID: number;
  bussinessID: any;
  projectTypeID: any;
  templateId: any;
  formSubmit: boolean = false;

  projectName: any;
  bussinessUnitName: any;
  accountName: any;
  headingLabels: any;

  constructor(
    private service: HTTPService,
    private fbr: FormBuilder,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private breadcrumbService: BreadcrumbService,
    private pageHeadingService: PageHeadingService,
    private titleService: Title
  ) {
    this.label = dashboard;
    this.headingLabels = headings;
    this.titleService.setTitle('Metrics: Select Metric Template');

    iconRegistry.addSvgIcon(
      'ui-checks',
      sanitizer.bypassSecurityTrustResourceUrl('assets/svg/ui-checks.svg')
    );

    iconRegistry.addSvgIcon(
      'ui-checks-white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/svg/ui-checks-white.svg')
    );

    iconRegistry.addSvgIcon(
      'take-ass',
      sanitizer.bypassSecurityTrustResourceUrl('assets/svg/take-ass.svg')
    );

    iconRegistry.addSvgIcon(
      'take-ass-white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/svg/take-ass-white.svg')
    );

    iconRegistry.addSvgIcon(
      'submit-ass',
      sanitizer.bypassSecurityTrustResourceUrl('assets/svg/submit-ass.svg')
    );

    iconRegistry.addSvgIcon(
      'submit-ass-white',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/svg/submit-ass-white.svg'
      )
    );
  }
  AllDetails = this.fbr.group({
    account: ['', [Validators.required]],
    project: ['', [Validators.required]],
    projectType: ['', [Validators.required]],
    template: ['', [Validators.required]],
  });
  get projectType() {
    return this.AllDetails.get('projectType');
  }

  // getAllBusinessUnits() {
  //   this.service.httpRequest(Apiurls.businessUnitApi, 'GET').subscribe(
  //     (businessUnitResponse) => {
  //       this.BusinessUnits = businessUnitResponse;
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  //   // this.getAllProjects();
  // }

  // getAllProjects() {
  
  //     this.AllDetails.get('businessUnit')?.valueChanges.subscribe((buId) => {
  //       if (buId !== '') {
  //         this.service.httpRequest(Apiurls.projectsApi + buId, 'GET').subscribe(
  //           (ProjectResponse: any) => {
  //             this.projects = ProjectResponse.filter(
  //               (x: any) => x.businessUnitId == buId
  //             );
  //           },
  //           (error) => {
  //             console.log(error);
  //           }
  //         );
  //       }
  //       this.getProjectTypes();
  //     });
    
  // }

  getAllAccountsByBU() {
      this.service.httpRequest(Apiurls.newAccountAPI, 'GET').subscribe(
        (accountResponse: any) => {
          this.accounts = accountResponse;
        },
        (error) => {
          console.log(error);
        }
      );
    
  }

  getProjectsByAccountId(accountId: number) {
    if (accountId !== null) {
      this.service
        .httpRequest(Apiurls.projectByAccountId + accountId, 'GET')
        .subscribe(
          (ProjectResponse: any) => {
            this.projects = ProjectResponse;
          },
          (error) => {
            console.log(error);
          }
        );
    }
    this.getProjectTypes();
  }

  getAllTemplates() {
    this.service
      .httpRequest(Apiurls.metricTemplate + this.projectTypeID, 'GET')
      .subscribe(
        (templateResponse) => {
          this.templates = templateResponse;
        },
        (error) => {
          console.log(error);
        }
      );

    this.templates = [];
  }

  getProjectTypes() {
    this.service.httpRequest(Apiurls.projectTypeApi, 'GET').subscribe(
      (projectTypeResponse) => {
        this.projectTypes = projectTypeResponse;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  submitForm(formValues: any) {
    this.formSubmit = true;
    if (this.AllDetails.valid) {
      this.router.navigate(['dashboard/metrics/submit-metric/metrics-template'], {
        queryParams: {
          businessUnitId: this.bussinessID,
          accountId: this.accountID,
          projectId: this.projectId,
          projectTypeId: this.projectTypeID,
          templateType: this.templateId,
          businessUnitName: this.bussinessUnitName,
          accountName: this.accountName,
          projectName: this.projectName,
        },
      });
    }
  }

  reset() {
    this.AllDetails.patchValue({
      account: '',
      project: '',
      projectType: '',
      template: '',
    });
    this.projects = [];
    this.accounts = [];
    this.projectTypes = [];
    this.templates = [];
  }

  onBUChange(e: any) {
    this.bussinessID = e.target.value;
    this.bussinessUnitName = this.BusinessUnits.find(
      (bu: any) => bu.id === +this.bussinessID
    ).name;
    this.getAllAccountsByBU();
  }

  onAccountChange(e: any) {
    this.accountID = e.target.value;
    this.accountName = this.accounts.find(
      (account: any) => account.accountId === +this.accountID
    ).accountName;
    this.getProjectsByAccountId(this.accountID);
  }

  onProjectChange(e: any) {
    this.projectId = e.target.value;
    this.projectName = this.projects.find(
      (project: any) => project.id === +this.projectId
    ).projectName;
  }

  onProjectTypeChange(e: any) {
    this.projectTypeID = e.target.value;
    this.getAllTemplates();
  }
  onTemplateChange(e: any) {
    this.templateId = e.target.value;
  }

  ngOnInit(): void {
    this.pageHeadingService.setPageTitle({
      display: true,
      heading: 'Metrics',
      subHeading: this.headingLabels.MetricsSubHeadingData,
    });
    this.breadcrumbService.set(
      '@selectMetricTemplate',
      'Select Metric Template'
    );
    // this.getAllBusinessUnits();
      this.getAllAccountsByBU()
  }
}
