import { FormBuilder } from '@angular/forms';
import {
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HTTPService } from 'src/app/service/http.service';
import { AssessmentControllerURL } from '../apis/apiurls';
import { MatDialog } from '@angular/material/dialog';
import { PreviewPopup } from 'src/app/common/PreviewPopup/PreviewPopup.component';
import { AzureService } from '../../service/azureAuth.service';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { BreadcrumbService } from 'xng-breadcrumb';
import { headings } from '../../constants/Labeles';
import { PageHeadingService } from 'src/app/service/pageHeader.service';
import { PageComponentService } from 'src/app/service/pageComponentControll.service';
import { debounceTime } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-assessment-template',
  templateUrl: './Assessment-template.component.html',
  styleUrls: ['./style.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class AssessmentTemplateComponent implements OnDestroy {
  categoryList: any;
  originalData: any;
  highWeightOptionIndex = 1;
  fileName = '';
  businessUnitId = '';
  accountId = '';
  projectTypeId = '';
  templateType = '';
  disableQuestion = false;
  respMsg = { type: '', message: '' };
  isSubmitted = false;
  isDisable = false;
  projectId: number = 0;
  businessUnitName: any;
  projectName: any;
  accountName: any;
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
    heading: 'Assessments',
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
  headingLabels: any;
  sectionSelection: any;
  showSections = [
    'header',
    'proJectDetails',
    'reviewerDetails',
    'questionList',
  ];
  containerScrollPercentage: any = 0;
  scrollActivePercentage: any = 96;

  constructor(
    private http: HttpClient,
    private service: HTTPService,
    private Activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private azureService: AzureService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private breadcrumbService: BreadcrumbService,
    private changeDetectorRef: ChangeDetectorRef,
    private PageHeadingService: PageHeadingService,
    private titleService: Title,
    public pageComponentService: PageComponentService,
    private loader: NgxUiLoaderService
  ) {
    this.titleService.setTitle('Assessments: Take-Assessment');
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

  @Input() popupAssessmentDetails: any;
  @Output() popupAssessmentGetDetails = new EventEmitter();

  @Input() previewObject: any = ' ';
  @Input() previewTemplate: boolean = false;

  ngOnInit() {
    if (!this.popupAssessmentDetails) {
      this.PageHeadingService.setPageTitle({
        display: !this.previewTemplate,
        heading: this.flowInforData.heading,
        subHeading: this.headingLabels.ReviewHeadingTitle,
      });
    } else {
      this.showSections =
        !!this.popupAssessmentDetails && this.popupAssessmentDetails.view;
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
      // if (params.has('businessUnitId'))
      // this.businessUnitId = params.get('businessUnitId')!;
      if (params.has('accountId')) this.accountId = params.get('accountId')!;
      if (params.has('projectTypeId'))
        this.projectTypeId = params.get('projectTypeId')!;
      if (params.has('templateType'))
        this.templateType = params.get('templateType')!;

      //new template flow1
      if (params.has('templateType')) {
        this.breadcrumbService.set('@assessmentTemplate', 'Take Assessment');
        this.flowInforData = {
          flowType: 'new',
          heading: 'Assessments',
          navigation: {
            text: 'Take Assessment',
            routerLink: 'dashboard/assessments',
            backHome: 'dashboard/assessments',
          },
        };
        this.PageHeadingService.setPageTitle({
          display: !this.previewTemplate,
          heading: this.flowInforData.heading,
          subHeading: this.headingLabels.assessmentSubHeading,
        });
        this.service
          .httpRequest(
            `/ee-dashboard/api/v1/template/id/${params.get('templateType')}`,
            'GET'
          )
          .subscribe((questionnaireResponse) => {
            this.categoryList = questionnaireResponse;
          });
      }
      //edit template
      if (
        params.has('questionEdit') ||
        params.has('questionView') ||
        this.popupAssessmentDetails
      ) {
        let id: any;
        if (!!params.has('questionEdit')) {
          //saved flow2
          id = params.get('questionEdit');
        } else {
          //submitted flow3 and 4
          id = !!params.get('questionView')
            ? params.get('questionView')
            : this.popupAssessmentDetails.id;
          this.assesmentId = id;
        }

        if (
          (params.has('templatePreview') && params.has('questionView')) ||
          (!!this.popupAssessmentDetails &&
            !!this.popupAssessmentDetails.questionView &&
            !!this.popupAssessmentDetails.popupTemplatePreview)
        ) {
          this.PageHeadingService.setPageTitle({
            display: true,
            heading: 'Templates',
            subHeading: 'Manage Templates',
          });
          this.breadcrumbService.set('@assessmentTemplate', 'Preview Template');
          this.titleService.setTitle('Templates: Preview Assessment Template');

          const templateId = !!params.get('questionView')
            ? params.get('questionView')
            : this.popupAssessmentDetails.questionView;

          this.service
            .httpRequest(
              `/ee-dashboard/api/v1/template/id/${templateId}`,
              'GET'
            )
            .subscribe((questionnaireResponse: any) => {
              this.originalData = deepCopy(questionnaireResponse);
              this.updateDisable();
              this.categoryList = questionnaireResponse;

              this.flowInforData.flowType = 'preview';

              this.emitProjectDetails();
            });
        } else {
          this.service
            .httpRequest(`/ee-dashboard/api/v1/assessment/${id}`, 'GET')
            .subscribe((questionnaireResponse: any) => {
              this.originalData = deepCopy(questionnaireResponse);

              if (questionnaireResponse.submitStatus === 'SAVE') {
                this.breadcrumbService.set(
                  '@assessmentTemplate',
                  'Saved Assessment'
                );
                this.titleService.setTitle('Assessment: Saved Assessment');

                this.flowInforData = {
                  flowType: 'saved',
                  status: '',
                  heading: 'Assessments',
                  navigation: {
                    text: 'Saved Assessment',
                    routerLink: 'dashboard/assessments',
                    backHome: 'dashboard/assessments',
                  },
                };
                this.PageHeadingService.setPageTitle({
                  display: !this.previewTemplate,
                  heading: this.flowInforData.heading,
                  subHeading: this.headingLabels.assessmentSubHeading,
                });
              } else if (
                questionnaireResponse.submitStatus === 'SUBMITTED' &&
                !params.has('reviewer')
              ) {
                // this.breadcrumbService.set(
                //   '@assessmentTemplate',
                //   'Submitted Assessment'
                // );
                this.titleService.setTitle(
                  this.popupAssessmentDetails.browswerTitle
                    ? this.popupAssessmentDetails.browswerTitle +
                        ': Submitted Assessment'
                    : 'Assessment: Submitted Assessment'
                );

                this.flowInforData = {
                  flowType: 'submitted',
                  status: '',
                  heading: 'Assessments',
                  navigation: {
                    text: 'Submitted Assessment',
                    routerLink: 'dashboard/assessments',
                    backHome: 'dashboard/assessments',
                  },
                  headingLabels: 'This is dynamic subheading',
                };
              } else if (
                questionnaireResponse.submitStatus === 'REVIEWED' &&
                !params.has('reviewer')
              ) {
                // this.breadcrumbService.set(
                //   '@assessmentTemplate',
                //   'Submitted Assessment'
                // );
                this.titleService.setTitle(
                  this.popupAssessmentDetails.browswerTitle
                    ? this.popupAssessmentDetails.browswerTitle +
                        ': Reviewed Assessment'
                    : 'Assessment: Reviewed Assessment'
                );

                this.flowInforData = {
                  flowType: 'reviewed',
                  status: 'reviewed',
                  heading: 'Assessments',
                  navigation: {
                    text: 'Reviewed Assessment',
                    routerLink: 'dashboard/assessments',
                    backHome: 'dashboard/assessments',
                  },
                  headingLabels: 'This is dynamic subheading',
                };
              } 
              else if (
                questionnaireResponse.submitStatus === 'INACTIVE' &&
                !params.has('reviewer')
              ) {
                // this.breadcrumbService.set(
                //   '@assessmentTemplate',
                //   'Submitted Assessment'
                // );
                this.titleService.setTitle(
                  this.popupAssessmentDetails.browswerTitle
                    ? this.popupAssessmentDetails.browswerTitle +
                        ': Inactive Assessment'
                    : 'Assessment: Inactive Assessment'
                );

                this.flowInforData = {
                  flowType: 'inactive',
                  status: 'inactive',
                  heading: 'Assessments',
                  navigation: {
                    text: 'Inactive Assessment',
                    routerLink: 'dashboard/assessments',
                    backHome: 'dashboard/assessments',
                  },
                  headingLabels: 'This is dynamic subheading',
                };
              }else if (questionnaireResponse.submitStatus === 'REJECTED') {
                // this.breadcrumbService.set(
                //   '@assessmentTemplate',
                //   'Rejected Assessment'
                // );
                this.titleService.setTitle(
                  this.popupAssessmentDetails.browswerTitle
                    ? this.popupAssessmentDetails.browswerTitle +
                        ': Rejected Assessment'
                    : 'Assessment: Rejected Assessment'
                );

                this.flowInforData = {
                  flowType: 'submitted',
                  status: 'rejected',
                  heading: 'Assessments',
                  cardSubHeading:
                    this.headingLabels.ReviewAssessmentSubHeading1,
                  navigation: {
                    text: 'Rejected Assessment',
                    routerLink: 'dashboard/assessments',
                    backHome: 'dashboard/assessments',
                  },
                };
              } else if (questionnaireResponse.submitStatus === 'APPROVED') {
                // this.breadcrumbService.set(
                //   '@assessmentTemplate',
                //   'Approved Assessment'
                // );
                this.titleService.setTitle(
                  this.popupAssessmentDetails.browswerTitle
                    ? this.popupAssessmentDetails.browswerTitle +
                        ': Approved Assessment'
                    : 'Assessment: Approved Assessment'
                );

                this.flowInforData = {
                  flowType: 'submitted',
                  status: 'approved',
                  heading: 'Assessments',
                  cardSubHeading:
                    this.headingLabels.ReviewAssessmentSubHeading1,
                  navigation: {
                    text: 'Approved Assessment',
                    routerLink: 'dashboard/assessments',
                    backHome: 'dashboard/assessments',
                  },
                };
              }
              this.checkReportsflow();
              this.updateDisable();
              this.categoryList = questionnaireResponse;
              this.emitProjectDetails();
            });
        }
      }

      //reviewer flow 5 (PM or Scrum master)
      if (params.has('reviewer')) {
        this.PageHeadingService.setPageTitle({
          display: true,
          heading: 'Reviews',
          subHeading: this.headingLabels.ReviewHeadingTitle,
        });
        this.breadcrumbService.set(
          '@assessmentTemplate',
          'Review Assessment Submission'
        );
        this.titleService.setTitle('Review Assessment Submission');
        this.flowInforData = {
          flowType: 'reviewer',
          status: params.get('reviewer'),
          heading: 'Review Assessment Submission',
          navigation: {
            text: 'Assessment - Submission For Review',
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
    var subHeading =
      this.flowInforData.status === 'rejected' ||
      this.flowInforData.status === 'approved'
        ? ''
        : this.headingLabels.ReviewAssessmentSubHeading1;
    if (this.popupAssessmentDetails.popupTemplatePreview) {
      subHeading = '';
    }
    this.popupAssessmentGetDetails.emit({
      flowInforData: this.flowInforData,
      headingLabels: subHeading,
      categoryList: this.categoryList,
      projectName: this.projectName,
      // businessUnitName: this.businessUnitName,
      accountName: this.accountName,
      selectedStep: this.selectedStep,
    });
  }

  checkReportsflow() {
    this.Activatedroute.queryParamMap.subscribe((params) => {
      //reports flow
      if (params.has('reportsFlow')) {
        this.flowInforData.flowType = 'reports';
        this.titleService.setTitle('Reports: Approved Assessment');
      }
    });
  }

  updateDisable() {
    this.disableQuestion =
      this.flowInforData.flowType === 'submitted' ||
      this.flowInforData.status === 'rejected' ||
      this.flowInforData.status === 'reviewed' ||
      this.flowInforData.status === 'approved' ||
      this.flowInforData.status === 'inactive' ||
      this.flowInforData.flowType === 'reviewed' ||
      this.flowInforData.flowType === 'reviewer' ||
      this.flowInforData.flowType === 'reports';
  }

  saveCategory() {
    const category = this.categoryList.projectCategory;
    for (let i = 0; i < category.length; i++) {
      const templateQuestionnaire = category[i].templateQuestionnaire;
      for (let j = 0; j < templateQuestionnaire.length; j++) {
        delete templateQuestionnaire[j].tempfileUri;
      }
    }

    this.categoryList.submitedBy = this.ssoUserInfo.idTokenClaims.oid;
    this.categoryList.submitterName = this.ssoUserInfo.name;
    this.isSubmitted = false;
    this.categoryList.projectId = this.projectId;
    this.categoryList.submitStatus = 'SAVE';
    //this.categoryList.businessUnitId = +this.businessUnitId;
    this.categoryList.accountId = +this.accountId;
    this.categoryList.projectTypeId = +this.projectTypeId;
    this.categoryList.templateType = this.templateType;

    this.service
      .httpRequest(
        AssessmentControllerURL.saveOrSubmitAssessment,
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
            subHeading: 'Your Assessment have been saved Successfully.',
            buttonText: 'Back Home',
            buttonText1: 'My Submissions',
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
            buttonText1: 'My Submissions',
          };
        },
        complete: () => {},
      });
  }

  submitCategory() {
    this.categoryList.submitedBy = this.ssoUserInfo.idTokenClaims.oid;
    this.categoryList.submitterName = this.ssoUserInfo.name;
    this.isSubmitted = true;
    this.categoryList.projectId = this.projectId;
    this.categoryList.submitStatus = 'SUBMITTED';
    //this.categoryList.businessUnitId = +this.businessUnitId;
    this.categoryList.accountId = +this.accountId;
    this.categoryList.projectTypeId = +this.projectTypeId;
    this.categoryList.templateType = this.templateType;

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

    if (!validation.includes(0)) {
      //make an API call
      //this.selectedStep = 2;
      // this.isPopupOpen = true;
      // this.popupData = {
      //   name: 'Are you sure you want to submit your assessment?',
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
          type: 'assessment',
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
    this.service
      .httpRequest(
        AssessmentControllerURL.saveOrSubmitAssessment,
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
          this.isConfirmPopup = true;
          this.loader.stop();
          this.breadcrumbService.set(
            '@assessmentTemplate',
            'Submit Assessment'
          );
          this.titleService.setTitle('Assessments: Submit-Assessment');
          this.confirmPopupData = {
            status: 'success',
            heading: 'Thank You For Taking Assessment!',
            subHeading: 'Your Assessment have been submitted Successfully.',
            buttonText: 'Back Home',
            buttonText1: 'My Submissions',
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
            buttonText1: 'My Submissions',
          };
        },
        complete: () => {},
      });
  }

  resetCategory() {
    if (this.flowInforData.flowType === 'saved') {
      this.categoryList = deepCopy(this.originalData);
    } else {
      const category = this.categoryList.projectCategory;
      for (let i = 0; i < category.length; i++) {
        const templateQuestionnaire = category[i].templateQuestionnaire;
        for (let j = 0; j < templateQuestionnaire.length; j++) {
          delete templateQuestionnaire[j].tempfileUri;
          delete templateQuestionnaire[j].fileUri;
          delete templateQuestionnaire[j].comment;
          delete templateQuestionnaire[j].isValid;
          delete templateQuestionnaire[j].answerOptionIndex;
        }
      }
    }

    this.isSubmitted = false;
    this.resetDefault();
  }

  validateQuestion(question: any) {
    if (question.answerOptionIndex) {
      // if (
      //   this.getCategoryOptionScore(
      //     question.answerOptionIndex,
      //     question.scoreCategory
      //   ) === this.highWeightOptionIndex
      // ) {
      //   if (question.comment === '' || question.fileUri === '') {
      //     question['isValid'] = false;
      //     return false;
      //   }
      //   question['isValid'] = true;
      //   return true;
      // }

      question['isValid'] = true;
      return true;
    }
    question['isValid'] = false;
    return false;
  }

  resetDefault(): void {
    this.respMsg = { type: '', message: '' };
  }

  // getCategoryOptionScore(answerOptionIndex: any, scoreCategory: string) {
  //   return this.getCategory(scoreCategory).find(
  //     (obj: any) => obj.optionIndex === answerOptionIndex
  //   )?.optionScore;
  // }

  backToHome(url: string) {
    /*   this.router.navigate([this.flowInforData.navigation.backHome]); */

    this.router.navigate([url]);
  }

  callSaveReviewCommentFun($event: any) {
    this.isPopupOpen = $event.isPopupOpen;
    this.isSaveAction = $event.isSaveAction;
    this.popupData = $event.popupData;
  }

  respMsgFun($event: any) {
    this.respMsg = $event;
  }

  returnAssessment(){
    this.loader.start();
    this.service
      .httpRequest(
        "Return assessment api",
        'PUT',
        this.popupData.payload
      )
      .subscribe({
        next: (saveReviewerCommentResponse: any) => {
          if (this.popupData.payload.status == 'APPROVED') {
            this.respMsg = {
              type: 'success',
              message: 'Assessment Approved Successfully!!!',
            };
          } else {
            this.respMsg = {
              type: 'success',
              message: 'Assessment Rejected Successfully!!!',
            };
          }
          //this.commentForm.reset();

          this.isConfirmPopup = true;
          this.loader.stop();
          this.flowInforData.navigation.backHome =
            'dashboard/review-assessments';
          this.confirmPopupData = {
            status: 'success',
            heading: 'Congratulations!',
            subHeading: 'Returned Successfully.',
            /*  buttonText: 'Back Home', */
            buttonText: 'Back Home',
            buttonText1:
              this.flowInforData.flowType === 'reviewer'
                ? 'Reviews'
                : 'My Submissions',
          };
        },
        error: (err) => {
          this.isConfirmPopup = true;
          this.loader.stop()
          this.flowInforData.navigation.backHome =
            'dashboard/review-assessments';
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

  submitReviewApiCall() {
    this.loader.start();
    this.service
      .httpRequest(
        AssessmentControllerURL.saveReviewerComment,
        'POST',
        this.popupData.payload
      )
      .subscribe({
        next: (saveReviewerCommentResponse: any) => {
          if (this.popupData.payload.status == 'APPROVED') {
            this.respMsg = {
              type: 'success',
              message: 'Assessment Approved Successfully!!!',
            };
          } else {
            this.respMsg = {
              type: 'success',
              message: 'Assessment Rejected Successfully!!!',
            };
          }
          //this.commentForm.reset();

          this.isConfirmPopup = true;
          this.loader.stop();
          this.flowInforData.navigation.backHome =
            'dashboard/review-assessments';
          this.confirmPopupData = {
            status: 'success',
            heading: 'Congratulations!',
            subHeading: 'Review Provided Successfully.',
            /*  buttonText: 'Back Home', */
            buttonText: 'Back Home',
            buttonText1:
              this.flowInforData.flowType === 'reviewer'
                ? 'Reviews'
                : 'My Submissions',
          };
        },
        error: (err) => {
          this.isConfirmPopup = true;
          this.loader.stop()
          this.flowInforData.navigation.backHome =
            'dashboard/review-assessments';
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

  clickOnYesConsent() {
    console.log(this.isSaveAction);
    
    this.isPopupOpen = false;
    this.pageComponentService.pageScroll('bottom');
    this.isSaveAction === 'saveCategory'
      ? this.saveCategory()
      : this.isSaveAction === 'submitAssessment'
      ? this.submitAssessment()
      : this.isSaveAction === 'returnApiCall'
      ? this.returnAssessment()
      : this.isSaveAction === 'submitReviewApiCall'
      ? this.submitReviewApiCall()
      : '';
  }

  ngOnDestroy() {
    this.popupAssessmentDetails = {};
  }
}
