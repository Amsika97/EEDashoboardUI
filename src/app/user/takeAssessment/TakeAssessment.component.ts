import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { dashboard } from '../../constants/dashboardLabels';
import { Apiurls } from '../apis/apiurls';
import { HTTPService } from 'src/app/service/http.service';
import { Businessunit } from 'src/app/model/businessunit';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
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
  selector: 'app-take-assessment',
  templateUrl: './TakeAssessment.component.html',
  styleUrls: ['./TakeAssessment.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class TakeAssessment implements OnInit {
  BusinessUnits: any;
  projects: any;
  accounts: any;
  templates: any;
  projectTypes: any;
  projectName: any;
  label: DashboardLabels;
  bussinessUnitName: any;
  accountName: any;
  accountID: number;
  projectId: any;
  bussinessID: any;
  projectTypeID: any;
  templateId: any;
  formSubmit = false;
  selectedStepIndex = 0;
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
    this.titleService.setTitle('Assessments: Select Assessment Template');
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
    // businessUnit: ['', [Validators.required]],
    account: ['', [Validators.required]],
    project: ['', [Validators.required]],
    projectType: ['', [Validators.required]],
    template: ['', [Validators.required]],
  });
  get businessUnit() {
    return this.AllDetails.get('businessUnit');
  }
  get projectType() {
    return this.AllDetails.get('projectType');
  }

  getAllBusinessUnits() {
    this.service.httpRequest(Apiurls.businessUnitApi, 'GET').subscribe(
      (businessUnitResponse) => {
        this.BusinessUnits = businessUnitResponse;
      },
      (error) => {
        console.log(error);
      }
    );
    // this.getAllProjects();
  }

  getAllAccountsByBU() {
    // if (this.businessUnit !== null) {
    // this.AllDetails.get('businessUnit')?.valueChanges.subscribe((buId) => {
    // if (buId !== '') {
    this.service.httpRequest(Apiurls.newAccountAPI, 'GET').subscribe(
      (accountResponse: any) => {
        this.accounts = accountResponse;
      },
      (error) => {
        console.log(error);
      }
    );
    // }
    // });
    // }
  }

  getAllProjects() {
    if (this.businessUnit !== null) {
      this.AllDetails.get('businessUnit')?.valueChanges.subscribe((buId) => {
        if (buId !== '') {
          this.service.httpRequest(Apiurls.projectsApi + buId, 'GET').subscribe(
            (ProjectResponse: any) => {
              this.projects = ProjectResponse.filter(
                (x: any) => x.businessUnitId == buId
              );
            },
            (error) => {
              console.log(error);
            }
          );
        }
        // this.getProjectTypes();
      });
    }
  }

  getProjectsByAccountId(accountId: number) {
    if (accountId !== null) {
      // this.AllDetails.get('account')?.valueChanges.subscribe((accId) => {
      // if (accId !== '') {
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
    // });
    // }
  }
  getAllTemplates() {
    this.service
      .httpRequest(Apiurls.templateTypeApi + this.projectTypeID, 'GET')
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
      this.router.navigate(
        ['dashboard/assessments/take-assessment/assessment-template'],
        {
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
        }
      );
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
    // this.getAllAccountsByBU(this.bussinessID);
  }

  onProjectChange(e: any) {
    this.projectId = e.target.value;
    this.projectName = this.projects.find(
      (project: any) => project.id === +this.projectId
    ).projectName;
  }

  onAccountChange(e: any) {
    this.accountID = e.target.value;
    this.accountName = this.accounts.find(
      (account: any) => account.accountId === +this.accountID
    ).accountName;
    this.getProjectsByAccountId(this.accountID);
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
      heading: 'Assessments',
      subHeading: this.headingLabels.AssessmentsSubHeadingData,
    });
    this.breadcrumbService.set('@selectTemplate', 'Select Assessment Template');
    // this.getAllBusinessUnits();
    this.getAllAccountsByBU();
  }

  /* getSanitizedSVG(svgFileName: string): SafeHtml {   
    const svgPath = `assets/svg/${svgFileName}`;   
    const svgContent = this.loadSVGContent(svgPath);   
    return this.sanitizer.bypassSecurityTrustHtml(svgContent); 
  }
  loadSVGContent(path: string): string {   
    // Use your preferred method to load the SVG content, such as HTTP request or FileReader   // For simplicity, assuming a synchronous HTTP request for demo purposes   
    const xhr = new XMLHttpRequest();   
    xhr.open('GET', path, false);   
    xhr.send();   
    if (xhr.status === 200) {     
      return xhr.responseText;   
    } else {     
      console.error(`Failed to load SVG from path: ${path}`);    
       return '';   
      }
  } */
}
