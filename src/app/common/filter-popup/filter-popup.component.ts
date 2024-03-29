import { Component, Inject, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {
  ICheckboxQuestion,
  IRadioQuestion,
  StatusIModel,
  SubmissionIModel,
} from 'src/app/Templates/Metrics/components/QuestionInterface';
import { AzureService } from 'src/app/service/azureAuth.service';
import { HTTPService } from 'src/app/service/http.service';
import { ValidationService } from 'src/app/service/validation.service';
import { Apiurls } from 'src/app/user/apis/apiurls';
import { environment } from 'src/environments/environment';
const ALL = 'All';
@Component({
  selector: 'app-filter-popup',
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.css'],
})
export class FilterPopupComponent {
  @Input() questionDetails: IRadioQuestion;
  @Input() disableQuestion: string | boolean;
  @Input() questionIndex: any;
  @Input() isSubmitted: any;
  @Input() projectType: ICheckboxQuestion;
  color: ThemePalette = 'primary';
  accountID: any;
  accounts: any;
  accountsList: any;
  projectsList: any;
  projects: any;
  templates: any;
  templateId: any;
  templatesList: any;
  submissionList: any;
  submitList: any;
  submitted: any;
  User: any[];
  Reviewer: any[];
  statusList: any;
  reviewList: any;
  reviewed: any;
  startValue = 0;
  endValue = 100;
  selectedReport: any = "BOTH";
  fromDate: any;
  toDate: any;
  AllData: any[];
  //Project Type
  projectTypeList: any;
  projectTypeselectedItems: any = [];
  projectTypeDropdownSettings!: IDropdownSettings;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  selectedProjectType: any;
  selectStatus = false;

  submissions: SubmissionIModel[] = [
    { submissionId: 7, submissionName: 'Last 7 Days' },
    { submissionId: 15, submissionName: 'Last 15 Days' },
    { submissionId: 30, submissionName: '1 Month' },
  ];

  statusSelect: StatusIModel[] = [
    { statusId: 'review', statusName: 'Reviewed' },
    { statusId: 'submit', statusName: 'Submitted' },
  ];

  statusSelectInactive: StatusIModel[] = [
    { statusId: 'review', statusName: 'Reviewed' },
    { statusId: 'submit', statusName: 'Submitted' },
    { statusId: 'inactive', statusName: 'Deleted' }
  ];

  constructor(
    private service: HTTPService,
    private validService: ValidationService,
    private userDetailsService: AzureService,
    private dialogRef: MatDialogRef<FilterPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.getprojectTypes();
    this.allAccounts();
    this.allTemplates();
    this.allSubmitsReviews();
    if(this.userDetailsService.getUserDetails().role === 'Admin') {
      this.selectStatus = true;
    }
  }

  radioChange(event: any, question: any) {
    question.answerValue = [event.value];
    this.isSubmitted && (question.isValid = !!question.answerValue.length);
    //this.radioCallbackEvent.emit({ event, question });
  }

  account(event: MatSelectChange) {
    this.accountID = event.value;
    this.allAccounts();
    this.allProjects();
  }

  allAccounts() {
    this.service.httpRequest(Apiurls.newAccountAPI, 'GET').subscribe((data) => {
      this.accounts = data;
    });
  }

  allProjects() {
    if (this.accountID) {
      this.service
        .httpRequest(Apiurls.projectByAccountId + this.accountID, 'GET')
        .subscribe((data) => {
          this.projects = data;
        });
    }
  }

  template(event: MatSelectChange) {
    this.templateId = event.value;
  }

  allTemplates() {
    this.service
      .getTemplate(environment.BASE_URL + Apiurls.templateAPI)
      .subscribe((data) => {
        this.templates = data;
      });
  }

  //projectTypeList
  getprojectTypes() {
    this.service
      .httpRequest('/ee-dashboard/api/v1/projectTypes', 'GET')
      .subscribe((respTypeList: any) => {
        this.projectTypeList = respTypeList.map((item: any) => ({
          ...item,
          checked: false,
        }));
      });
  }

  checkUnProtoTypeOptions(optionObj: any) {
    optionObj.option === ALL
      ? this.projectTypeList.map((obj: any) => (obj.checked = optionObj.val))
      : (this.projectTypeList.find(
          (obj: any) => obj.id === optionObj.option
        ).checked = optionObj.val);
  }

  getCheckedLength(list: any) {
    return list.filter((obj: any) => obj.checked).length;
  }

  onProtoTypeCheck($event: any, projectObj: any) {
    if (!!$event.target.checked) {
      //check all
      if (projectObj.projectTypeName === ALL) {
        this.checkUnProtoTypeOptions({
          option: projectObj.projectTypeName,
          val: true,
        });
      } else {
        this.checkUnProtoTypeOptions({
          option: projectObj.id,
          val: true,
        });

        this.getCheckedLength(this.projectTypeList) ===
          this.projectTypeList.length - 1 &&
          this.checkUnProtoTypeOptions({
            option: ALL,
            val: true,
          });
      }
    } else {
      //uncheck all
      if (projectObj.projectTypeName === ALL) {
        this.checkUnProtoTypeOptions({
          option: ALL,
          val: false,
        });
      } else {
        this.checkUnProtoTypeOptions({
          option: projectObj.id,
          val: false,
        });

        this.getCheckedLength(this.projectTypeList) <=
          this.projectTypeList.length &&
          this.checkUnProtoTypeOptions({
            option: this.projectTypeList.find(
              (obj: any) => obj.projectTypeName === ALL
            ).id,
            val: false,
          });
      }
    }
  }

  submission(event: any) {
    if(this.submissionList) {
      this.fromDate = null;
      this.toDate = null;
    }
  }

  startDate(event: any) {
    if(this.fromDate) {
      this.submissionList = null;
    }
  }

  endDate(event: any) {
    if(this.toDate) {
      this.submissionList = null;
    }
  }

  submit(event: any) {}

  allSubmitsReviews() {
    this.service
      .getTemplate(environment.BASE_URL + Apiurls.statusTypeApi)
      .subscribe((data: any) => {
        this.submitted = data;
      });
  }

  review(event: any) {}

  onSubmitInputChange(event: any) {
    const searchInput = event.target.value.toLowerCase();
    this.submitted = this.User.filter(({ userName }) => {
      const name = userName.toLowerCase();
      return name.includes(searchInput);
    });
  }

  onReviewInputChange(event: any) {
    const searchInput = event.target.value.toLowerCase();
    this.reviewed = this.Reviewer.filter(({ userName }) => {
      const name = userName.toLowerCase();
      return name.includes(searchInput);
    });
  }

  status(event: any) {}

  buttonCallBackFun() {
    let t = this.projectTypeList
      .filter((opt: any) => opt.checked)
      .map((opt: any) => opt.id);
    this.selectedProjectType = t;
    const data = {
      reportFilterType: this.selectedReport,
      accountId: this.accountsList,
      projectIds: this.projectsList,
      templateId: this.templatesList,
      submissionPeriodDays: this.submissionList,
      submissionFromDate: this.fromDate,
      submissionToDate: this.toDate,
      scoreFromRange: this.startValue,
      scoreToRange: this.endValue,
      projectType: this.selectedProjectType ? this.selectedProjectType : 0,
      submittedBy: this.submitList,
      reviewedBy: this.reviewList,
      submitStatus: this.statusList
    };

    this.service.getLoginDetails(Apiurls.reportFiltersApi, data).subscribe((data) => {
      if(data) {
        this.dialogRef.close();
        this.validService.passReportsFilterValue(data);
      }
    });
  }
}
