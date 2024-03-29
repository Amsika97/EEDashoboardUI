import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HTTPService } from 'src/app/service/http.service';
import { AssessmentControllerURL } from '../apis/apiurls';
import { MatDialog } from '@angular/material/dialog';
import { AzureService } from '../../service/azureAuth.service';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { BreadcrumbService } from 'xng-breadcrumb';
import { headings } from '../../constants/Labeles';
import { PageHeadingService } from 'src/app/service/pageHeader.service';
import { PageComponentService } from 'src/app/service/pageComponentControll.service';
import { debounceTime } from 'rxjs/operators';
import { PreviewPopup } from 'src/app/common/PreviewPopup/PreviewPopup.component';
import { ValidationService } from 'src/app/service/validation.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-metrics-template',
  templateUrl: './Metrics-Template.component.html',
  styleUrls: ['./style.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class MetricsTemplateComponent implements OnDestroy {
  categoryList: any;
  originalData: any;
  isSaveOrSubmit: any;
  highWeightOptionIndex = 5;
  fileName = '';
  disableQuestion = false;
  respMsg = { type: '', message: '' };
  isSubmitted = false;
  projectId: number = 0;
  businessUnitId = '';
  accountId = '';
  projectTypeId = '';
  businessUnitName: any;
  projectName: any;
  accountName: any;
  templateType = '';
  metricTemplateId = '';
  ssoUserInfo = {
    name: '',
    role: '',
    username: '',
    idTokenClaims: {
      oid: '',
    },
  };
  assesmentId: number = 0;
  flowInforData: any = {
    flowType: '',
    status: '',
    heading: 'Metrics',
    navigation: {
      text: '',
      routerLink: '',
    },
  };

  isPopupOpen = false;
  popupData: any;
  isSaveAction: string;
  isConfirmPopup = false;
  confirmPopupData: any;
  selectedStep = 1;
  isSubmittedForReviewer: any;
  headingLabels: any;
  showSections = [
    'header',
    'proJectDetails',
    'reviewerDetails',
    'questionList',
  ];

  containerScrollPercentage: any = 0;
  scrollActivePercentage: any = 96;

  constructor(
    private service: HTTPService,
    private Activatedroute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private azureService: AzureService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private breadcrumbService: BreadcrumbService,
    private pageHeadingService: PageHeadingService,
    private titleService: Title,
    public pageComponentService: PageComponentService,
    private PageHeadingService: PageHeadingService,
    private validService: ValidationService,
    private loader: NgxUiLoaderService
  ) {
    this.titleService.setTitle('Metrics: Submit Metrics');
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
      'selected-take-ass',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/svg/selected-take-ass.svg'
      )
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
      'selected-submit-ass',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/svg/selected-submit-ass.svg'
      )
    );

    iconRegistry.addSvgIcon(
      'submit-ass-white',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/svg/submit-ass-white.svg'
      )
    );

    iconRegistry.addSvgIcon(
      'rejected',
      sanitizer.bypassSecurityTrustResourceUrl('assets/svg/Group 11217.svg')
    );
    this.headingLabels = headings;
  }

  @Output() scrollToBottom = new EventEmitter();

  @Input() popupMetricsDetails: any;
  @Output() popupMetricsGetDetails = new EventEmitter();

  @Input() previewObject: any = ' ';
  @Input() previewTemplate: boolean = false;
  @Input() popupMetricsId: any;
  @Input() browserTitle: any;

  @Input() popupQuestionView: any;
  @Input() popupTemplatePreview: any;

  ngOnInit() {
    if (!this.popupMetricsDetails) {
      this.pageHeadingService.setPageTitle({
        display: !this.previewTemplate,
        heading: this.flowInforData.heading,
        subHeading: this.headingLabels.ReviewMetricsSubHeading,
      });
    } else {
      this.showSections =
        !!this.popupMetricsDetails && this.popupMetricsDetails.view;
    }
    this.azureService.userSubject.subscribe((data) => {
      this.ssoUserInfo = {
        name: data.name,
        role: data.role,
        username: data.username,
        idTokenClaims: {
          oid: data.idTokenClaims.oid,
        },
      };
    });

    const SSOData: any = this.azureService.getUserDetails();
    this.ssoUserInfo = {
      name: SSOData.name,
      role: SSOData.role,
      username: SSOData.username,
      idTokenClaims: {
        oid: SSOData.idTokenClaims?.oid!,
      },
    };
    this.pageComponentService.scrollPercentage
      .pipe(debounceTime(100))
      .subscribe((data) => {
        this.containerScrollPercentage = data;

        if (data >= this.scrollActivePercentage)
          setTimeout(() => {
            this.pageComponentService.pageScroll('bottom');
          }, 1);
      });

    this.Activatedroute.queryParamMap.subscribe((params) => {
      if (params.has('accountName'))
        this.accountName = params.get('accountName');
      if (params.has('businessUnitName'))
        this.businessUnitName = params.get('businessUnitName');
      if (params.has('projectName'))
        this.projectName = params.get('projectName');
      if (params.has('projectId')) this.projectId = +params.get('projectId')!;
      if (params.has('businessUnitId'))
        this.businessUnitId = params.get('businessUnitId')!;
      if (params.has('accountId')) this.accountId = params.get('accountId')!;
      if (params.has('projectTypeId'))
        this.projectTypeId = params.get('projectTypeId')!;
      if (params.has('templateType'))
        this.templateType = params.get('templateType')!;

      //new template flow1
      if (params.has('templateType')) {
        this.breadcrumbService.set('@metricsTemplate', 'Submit Metrics');
        this.flowInforData.flowType = 'new';
        this.flowInforData.heading = 'Metrics';
        this.flowInforData.navigation = {
          text: 'Submit Metrics',
          routerLink: 'dashboard/metrics',
          backHome: 'dashboard/metrics',
        };
        this.PageHeadingService.setPageTitle({
          display: !this.previewTemplate,
          heading: this.flowInforData.heading,
          subHeading: this.headingLabels.metricsSubHeading,
        });
        //this.categoryList = newMetricTemplateData;

        this.service
          .httpRequest(
            `/ee-dashboard/api/v1/metric/templateId/${params?.get(
              'templateType'
            )}`,
            'GET'
          )
          .subscribe((questionnaireResponse) => {
            this.categoryList = questionnaireResponse;
            this.originalData = JSON.parse(
              JSON.stringify(questionnaireResponse)
            );
          });
      }
      //edit template
      if (
        params.has('questionEdit') ||
        params.has('questionView') ||
        this.popupMetricsDetails
      ) {
        let id: any;
        if (params.has('questionEdit')) {
          //saved flow2
          id = params.get('questionEdit');
        } else {
          //submitted flow3 and 4
          id = params.get('questionView')
            ? params.get('questionView')
            : this.popupMetricsDetails.id;
          this.assesmentId = id;
        }

        this.service
          .httpRequest(`/ee-dashboard/api/v1/metric/${id}`, 'GET')
          .subscribe((questionnaireResponse: any) => {
            this.originalData = JSON.parse(
              JSON.stringify(questionnaireResponse)
            );

            if (questionnaireResponse.submitStatus === 'SAVE') {
              this.breadcrumbService.set('@metricsTemplate', 'Saved Metrics');
              this.titleService.setTitle('Metrics: Saved Metrics');
              this.flowInforData = {
                flowType: 'saved',
                status: '',
                heading: 'Metrics',
                navigation: {
                  text: 'Saved Metrics',
                  routerLink: 'dashboard/metrics',
                  backHome: 'dashboard/metrics',
                },
              };
              this.PageHeadingService.setPageTitle({
                display: !this.previewTemplate,
                heading: this.flowInforData.heading,
                subHeading: this.headingLabels.metricsSubHeading,
              });
            } else if (
              questionnaireResponse.submitStatus === 'SUBMITTED' &&
              !params.has('reviewer')
            ) {
              // this.breadcrumbService.set(
              //   '@metricsTemplate',
              //   'Submitted Metrics'
              // );
              this.titleService.setTitle(
                this.browserTitle
                  ? this.browserTitle + ': Submitted Metrics'
                  : 'Metrics: Submitted Metrics'
              );
              this.flowInforData = {
                flowType: 'submitted',
                heading: 'Metrics',
                status: '',
                navigation: {
                  text: 'Submitted Metrics',
                  routerLink: 'dashboard/metrics',
                  backHome: 'dashboard/metrics',
                },
              };
            } else if (
              questionnaireResponse.submitStatus === 'REVIEWED' &&
              !params.has('reviewer')
            ) {
              // this.breadcrumbService.set(
              //   '@metricsTemplate',
              //   'Submitted Metrics'
              // );
              this.titleService.setTitle(
                this.browserTitle
                  ? this.browserTitle + ': Reviewed Metrics'
                  : 'Metrics: Reviewed Metrics'
              );
              this.flowInforData = {
                flowType: 'reviewed',
                heading: 'Metrics',
                status: 'reviewed',
                navigation: {
                  text: 'Reviewed Metrics',
                  routerLink: 'dashboard/metrics',
                  backHome: 'dashboard/metrics',
                },
              };
            }else if (
              questionnaireResponse.submitStatus === 'INACTIVE' &&
              !params.has('reviewer')
            ) {
              // this.breadcrumbService.set(
              //   '@metricsTemplate',
              //   'Submitted Metrics'
              // );
              this.titleService.setTitle(
                this.browserTitle
                  ? this.browserTitle + ': Reviewed Metrics'
                  : 'Metrics: Reviewed Metrics'
              );
              this.flowInforData = {
                flowType: 'inactive',
                heading: 'Metrics',
                status: 'inactive',
                navigation: {
                  text: 'Inactive Metrics',
                  routerLink: 'dashboard/metrics',
                  backHome: 'dashboard/metrics',
                },
              };
            } else if (questionnaireResponse.submitStatus === 'REJECTED') {
              // this.breadcrumbService.set(
              //   '@metricsTemplate',
              //   'Rejected Metrics'
              // );
              this.titleService.setTitle(
                this.browserTitle
                  ? this.browserTitle + ': Rejected Metrics'
                  : 'Metrics: Rejected Metrics'
              );
              this.flowInforData = {
                flowType: 'submitted',
                status: 'rejected',
                heading: 'Metrics',
                navigation: {
                  text: 'Rejected Metrics',
                  routerLink: 'dashboard/metrics',
                  backHome: 'dashboard/metrics',
                },
              };
            } else if (questionnaireResponse.submitStatus === 'APPROVED') {
              // this.breadcrumbService.set(
              //   '@metricsTemplate',
              //   'Approved Metrics'
              // );
              this.titleService.setTitle(
                this.browserTitle
                  ? this.browserTitle + ': Approved Metrics'
                  : 'Metrics: Approved Metrics'
              );
              this.flowInforData = {
                flowType: 'submitted',
                status: 'approved',
                heading: 'Metrics',
                navigation: {
                  text: 'Approved Metrics',
                  routerLink: 'dashboard/metrics',
                  backHome: 'dashboard/metrics',
                },
              };
            }

            this.checkReportsflow();
            this.updateDisable();
            this.categoryList = questionnaireResponse;
            this.emitProjectDetails();
          });
      }

      if (
        (params.has('templatePreview') && params.has('questionView')) ||
        (!!this.popupMetricsDetails &&
          !!this.popupMetricsDetails.questionView &&
          !!this.popupMetricsDetails.popupTemplatePreview)
      ) {
        this.breadcrumbService.set('@metricsTemplate', 'Preview Template');
        this.titleService.setTitle('Templates: Preview Metrics Template');
        const templateId = !!params.get('questionView')
          ? params.get('questionView')
          : this.popupMetricsDetails.questionView;

        this.service
          .httpRequest(
            `/ee-dashboard/api/v1/metric/templateId/${templateId}`,
            'GET'
          )
          .subscribe((questionnaireResponse: any) => {
            this.originalData = deepCopy(questionnaireResponse);
            this.updateDisable();
            this.categoryList = questionnaireResponse;
            this.flowInforData.flowType = 'preview';
            this.emitProjectDetails();
          });
      }

      //reviewer flow 5 (PM or Scrum master)
      if (params.has('reviewer')) {
        this.PageHeadingService.setPageTitle({
          display: true,
          heading: 'Reviews',
          subHeading: this.headingLabels.ReviewMetricsSubHeadingh,
        });
        this.breadcrumbService.set(
          '@metricsTemplate',
          'Review Metrics Submission'
        );
        this.titleService.setTitle('Review Metrics Submission');
        this.flowInforData = {
          flowType: 'reviewer',
          status: params.get('reviewer'),
          heading: 'Review Metrics Submission',
          navigation: {
            text: 'Metrics - Submission For Review',
            routerLink: 'dashboard/review-assessments',
            backHome: 'dashboard/metrics',
          },
        };
      }

      //preview flow 6
      if (
        this.previewObject &&
        this.previewObject !== ' ' &&
        this.previewObject !== ''
      ) {
        this.breadcrumbService.set('@metricsTemplate', 'Preview Template');
        this.titleService.setTitle('Templates: Metrics Preview Template');
        this.flowInforData = {
          flowType: 'preview',
          status: '',
          heading: 'Templates',
          navigation: {
            text: '',
            routerLink: '',
            backHome: '',
          },
        };
        this.PageHeadingService.setPageTitle({
          display: true,
          heading: this.flowInforData.heading,
          subHeading: 'Manage Templates',
        });
        this.updateDisable();

        this.categoryList = this.previewObject;
      }
    });
  }

  emitProjectDetails() {
    var subHeading = this.headingLabels.ReviewMetricsSubHeadingsun;
    if (this.popupMetricsDetails.popupTemplatePreview) {
      subHeading = '';
    }
    this.popupMetricsGetDetails.emit({
      flowInforData: this.flowInforData,
      headingLabels: subHeading,
      categoryList: this.categoryList,
      projectName: this.projectName,
      businessUnitName: this.businessUnitName,
      accountName: this.accountName,
      selectedStep: this.selectedStep,
    });
  }

  checkReportsflow() {
    this.Activatedroute.queryParamMap.subscribe((params) => {
      //reports flow
      if (params.has('reportsFlow')) {
        this.flowInforData.flowType = 'reports';
      }
    });
  }

  updateDisable() {
    this.disableQuestion =
      this.flowInforData.flowType === 'submitted' ||
      this.flowInforData.flowType === 'reviewed' ||
      this.flowInforData.status === 'rejected' ||
      this.flowInforData.status === 'approved' ||
      this.flowInforData.status === 'inactive' ||
      this.flowInforData.status === 'reviewed' ||
      this.flowInforData.flowType === 'reviewer' ||
      this.flowInforData.flowType === 'reports';
  }

  saveCategory() {
    this.categoryList.submittedBy = this.ssoUserInfo.idTokenClaims.oid;
    this.categoryList.submitterName = this.ssoUserInfo.name;
    this.isSubmitted = false;
    this.categoryList.projectId = this.projectId;
    this.categoryList.submitStatus = 'SAVE';
    this.categoryList.businessUnitId = +this.businessUnitId;
    this.categoryList.accountId = +this.accountId;
    this.categoryList.projectTypeId = +this.projectTypeId;
    this.categoryList.templateType = this.templateType;
    this.categoryList.metricTemplateId = this.categoryList.templateId
      ? this.categoryList.templateId
      : this.categoryList.metricTemplateId;

    //make a api call
    this.service
      .httpRequest(
        AssessmentControllerURL.saveOrMetrics,
        'POST',
        this.categoryList
      )
      .subscribe({
        next: (saveQuestionnaireResponse) => {
          this.respMsg = {
            type: 'success',
            message: 'Saved Successfully!!!',
          };
          this.categoryList = saveQuestionnaireResponse;
          this.isConfirmPopup = true;
          this.confirmPopupData = {
            status: 'success',
            heading: 'Saved Successfully!',
            subHeading: 'Your Metric have been saved Successfully.',
            buttonText: 'Back Home',
            buttonText1:
              this.flowInforData.flowType === 'reviewer'
                ? 'Reviews'
                : 'My Submissions',
          };
        },
        error: (err) => {
          this.respMsg = { type: 'failure', message: err.message };

          this.isConfirmPopup = true;
          this.confirmPopupData = {
            status: 'failure',
            heading: 'Something went wrong!',
            subHeading: 'Please check with your admin.',
            buttonText: 'Back Home',
            buttonText1:
              this.flowInforData.flowType === 'reviewer'
                ? 'Reviews'
                : 'My Submissions',
          };
        },
        complete: () => {},
      });
  }

  submitCategory() {
    this.categoryList.submittedBy = this.ssoUserInfo.idTokenClaims.oid;
    this.categoryList.submitterName = this.ssoUserInfo.name;
    this.isSubmitted = true;

    this.categoryList.projectId = this.projectId;
    this.categoryList.submitStatus = 'SUBMITTED';
    this.categoryList.businessUnitId = +this.businessUnitId;
    this.categoryList.accountId = +this.accountId;
    this.categoryList.projectTypeId = +this.projectTypeId;
    this.categoryList.templateType = this.templateType;
    this.categoryList.metricTemplateId = this.categoryList.templateId
      ? this.categoryList.templateId
      : this.categoryList.metricTemplateId;

    this.categoryList.metricTemplateId = this.categoryList.templateId
      ? this.categoryList.templateId
      : this.categoryList.metricTemplateId;

    const category = this.categoryList.projectCategory;
    let validation = [];
    let invalidQuestionId: any[] = [];
    for (let i = 0; i < category.length; i++) {
      const templateQuestionnaire = category[i].templateQuestionnaire;
      for (let j = 0; j < templateQuestionnaire.length; j++) {
        if (this.validateQuestion(templateQuestionnaire[j])) validation.push(1);
        else validation.push(0);

        !templateQuestionnaire[j].isValid &&
          invalidQuestionId.push(category[i].categoryName + (j + 1));
      }
    }

    if (true) {
      //make an API call
      //console.log('submit successfully', this.categoryList);
      // this.selectedStep = 2;
      // this.isPopupOpen = true;
      // this.popupData = {
      //   name: 'Are you sure you want to submit your metrics?',
      // };

      const dialogRef = this.dialog.open(PreviewPopup, {
        data: {
          flowInforData: this.flowInforData,
          categoryList: this.categoryList,
          disableQuestion: this.disableQuestion,
          originalData: this.originalData,
          isSubmitted: this.isSubmitted,
          assesmentId: this.assesmentId,
          popupData: this.popupData,
          respMsg: this.respMsg,
          type: 'metric',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'yes') {
          this.selectedStep = 2;
          this.clickOnYesConsent();
        }
      });
    } else {
      setTimeout(() => {
        const element = document.getElementById(invalidQuestionId[0])!;
        !!element &&
          element.scrollIntoView({
            behavior: 'smooth',
          });
      }, 10);
    }
  }

  submitAssessment() {
    this.loader.start();
    //this.isSaveOrSubmit = false
    this.service
      .httpRequest(
        AssessmentControllerURL.saveOrMetrics,
        'POST',
        this.categoryList
      )
      .subscribe({
        next: (SubmittedQuestionnaireResponse) => {
          this.selectedStep = 3;
          this.respMsg = {
            type: 'success',
            message: 'Submitted Successfully!!!',
          };
          this.categoryList = SubmittedQuestionnaireResponse;
          this.service.passValue(true);
          this.isConfirmPopup = true;
          this.loader.stop();
          //this.isSaveOrSubmit = true
          this.breadcrumbService.set('@metricsTemplate', 'Submit Metrics');
          this.titleService.setTitle('Metrics: Submit-Metrics');
          this.confirmPopupData = {
            status: 'success',
            heading: 'Thank You For Taking Metric!',
            subHeading: 'Your Metrics have been submitted Successfully.',
            buttonText: 'Back Home',
            buttonText1:
              this.flowInforData.flowType === 'reviewer'
                ? 'Reviews'
                : 'My Submissions',
          };
        },
        error: (err) => {
          this.respMsg = { type: 'failure', message: err.message };
          this.isConfirmPopup = true;
          this.confirmPopupData = {
            status: 'failure',
            heading: 'Something went wrong!',
            subHeading: 'Please check with your admin.',
            /*   buttonText: 'BACK HOME', */
            buttonText: 'Back Home',
            buttonText1:
              this.flowInforData.flowType === 'reviewer'
                ? 'Reviews'
                : 'My Submissions',
          };
        },
        complete: () => {},
      });
  }

  submitReviewApiCall() {
    this.loader.start();
    this.service
      .httpRequest(
        AssessmentControllerURL.saveReviewerMetricComment,
        'POST',
        this.popupData.payload
      )
      .subscribe({
        next: (saveReviewerCommentResponse: any) => {
          if (this.popupData.payload.status == 'APPROVED') {
            this.respMsg = {
              type: 'success',
              message: 'Sent for Approval Successfully!!!',
            };
          } else {
            this.respMsg = {
              type: 'success',
              message: 'Rejected Successfully!!!',
            };
          }
          //this.commentForm.reset();

          this.isConfirmPopup = true;
          this.loader.stop();
          this.flowInforData.navigation.backHome = '/review-assessments';
          this.confirmPopupData = {
            status: 'success',
            heading: 'Congratulations!',
            subHeading: 'Review Provided Successfully.',
            /*  buttonText: 'BACK HOME', */
            buttonText: 'Back Home',
            buttonText1:
              this.flowInforData.flowType === 'reviewer'
                ? 'Reviews'
                : 'My Submissions',
          };
        },
        error: (err) => {
          this.isConfirmPopup = true;
          this.flowInforData.navigation.backHome = '/review-assessments';
          this.confirmPopupData = {
            status: 'failure',
            heading: 'Something went wrong!',
            subHeading: 'Please check with your admin.',
            buttonText: 'Back Home',
            buttonText1: 'Reviews',
          };

          this.respMsg = { type: 'failure', message: err.message };
        },
        complete: () => {},
      });
  }

  resetCategory() {
    this.categoryList = JSON.parse(JSON.stringify(this.originalData));

    this.isSubmitted = false;
    this.resetDefault();
  }

  validateQuestion(question: any) {
    if (question.fieldType === 'file') {
      question['isValid'] = true;
      return true;
    }
    if (
      !!question.answerValue &&
      !!question.answerValue.length &&
      question.answerValue[0] !== ''
    ) {
      question['isValid'] = true;
      return true;
    }

    question['isValid'] = false;
    return false;
  }

  resetDefault(): void {
    this.respMsg = { type: '', message: '' };
  }

  backToHome(url: string) {
    /*     this.router.navigate([this.flowInforData.navigation.backHome]); */
    this.router.navigate([url]);
  }

  clickOnYesConsent() {
    this.isPopupOpen = false;
    this.service.submittedBoolean = true;
    this.pageComponentService.pageScroll('bottom');
    this.isSaveAction === 'saveCategory'
      ? this.saveCategory()
      : this.isSaveAction === 'submitAssessment'
      ? this.submitAssessment()
      : this.isSaveAction === 'submitReviewApiCall'
      ? this.submitReviewApiCall()
      : '';
  }
  callSaveReviewCommentFun($event: any) {
    this.isPopupOpen = $event.isPopupOpen;
    this.isSaveAction = $event.isSaveAction;
    this.popupData = $event.popupData;
  }

  noCallSaveReviewComment() {
    this.isPopupOpen = false;
    this.selectedStep = 1;
    this.validService.passValue(this.popupData);
  }

  respMsgFun($event: any) {
    this.respMsg = $event;
  }

  ngOnDestroy() {
    this.popupMetricsDetails = {};
  }
}
