import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmationPopupComponent } from 'src/app/common/ConfirmationPopup/ConfirmationPopup.component';
import { ConsentPopupComponent } from 'src/app/common/consentPopup/consentPopup.component';
import { AzureService } from 'src/app/service/azureAuth.service';
import { HTTPService } from 'src/app/service/http.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { PageHeadingService } from 'src/app/service/pageHeader.service';
import { Title } from '@angular/platform-browser';
const ALL = 'All';

@Component({
  selector: 'app-addmeteics',
  templateUrl: './addmeteics.component.html',
  styleUrls: ['./addmeteics.component.css'],
})
export class AddmeteicsComponent implements OnInit {
  ssoUserInfo = {
    name: '',
    role: '',
    username: '',
    idTokenClaims: {
      oid: '',
    },
  };
  previewTemplateData: any;
  addMeteicsForm!: FormGroup;
  previewTemplate: boolean = false;
  projectTypeDropdownSettings!: IDropdownSettings;
  projectTypeselectedItems: any = [];
  projectTypeList: any = [];
  scoreListAll: any = [];
  selctAllId: any;
  isPresent: boolean = false;
  pattern = '^[a-zA-Z0-9_ -]{1,50}$';

  extractedIds: any = [];
  selectedScore: string | undefined; // This variable will store the selected name
  selectedScoreId: number | undefined; // This variable will store the selected ID
  templateUploadedUserId: any;
  templateUploadedUserName: any;
  selectedNode: any;
  jsonValidFlag = false;
  formSubmit: boolean = false;
  isProjectTypeError = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private service: HTTPService,
    private router: Router,
    public dialog: MatDialog,
    private azureService: AzureService,
    private breadcrumbService: BreadcrumbService,
    private pageHeadingService: PageHeadingService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Create Metrics Template');
  }
  //JSON Select Score validation
  validateJson() {
    this.jsonValidFlag = this.isCheckJson();
  }
  isCheckJson() {
    try {
      // let stringi = JSON.stringify(this.selectedNode);
      const covcoveringJson = this.selectedNode.toString();
      const parsed = JSON.parse(covcoveringJson);
      if (parsed && typeof parsed === 'object') {
        return false;
      } else {
        return true;
      }
    } catch {
      return true;
    }
    // return false;
  }

  ngOnInit(): void {
    this.pageHeadingService.setPageTitle({
      display: true,
      heading: 'Templates',
      subHeading: 'Manage Templates',
    });
    this.breadcrumbService.set('@addMetrics', 'Create Metrics Template');
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

    let scoreList: any[] = [];

    //score list
    this.getprojectTypes();

    this.addMeteicsForm = this.formBuilder.group({
      templateName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(this.pattern),
        ],
      ],
      description: ['', [Validators.required]],
      templateData: ['', [Validators.required]],
      templateFrequency: ['', [Validators.required]],
    });

    this.projectTypeDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'projectTypeName',
      /*   selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All', */
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: false,
    };
  }

  //projectTypeList
  getprojectTypes() {
    this.service
      .httpRequest('/ee-dashboard/api/v1/projectTypes', 'GET')
      .subscribe((respTypeList) => {
        this.projectTypeList = respTypeList;
      });
  }
  //preview template function

  buttonCallBackFun(data: any) {
    this.formSubmit = true;
    if (this.projectTypeList.find((p: any) => p.checked)) {
      this.isProjectTypeError = false;
    } else {
      this.isProjectTypeError = true;
    }
    if (
      this.addMeteicsForm.valid &&
      this.projectTypeList.find((p: any) => p.checked)
    ) {
      this.isProjectTypeError = false;
      const allObj = this.projectTypeList.find((p: any) => {
        return p.projectTypeName == 'All';
      });
      data.projectTypes = allObj.checked
        ? [allObj.id]
        : this.projectTypeList
            .filter((p: any) => {
              return p.checked;
            })
            .map((p: any) => {
              return p.id;
            });
      this.extractedIds = data.projectTypes;

      data.templateUploadedUserId = this.ssoUserInfo.idTokenClaims.oid;
      data.templateUploadedUserName = this.ssoUserInfo.name;
      this.service
        .httpRequest(
          '/ee-dashboard/api/v1/metric/template/preview',
          'POST',
          data
        )
        .subscribe({
          next: (resp) => {
            if (!!resp) {
              this.previewTemplateData = resp;
              this.previewTemplate = true;
              this.breadcrumbService.set('@addMetrics', 'Preview Template');
            }
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }
  //Project Type
  /*   onItemSelectProjectType(item: any) {} */
  onSelectAllProjectType(items: any) {}
  //Project Type
  onItemSelectProjectType(item: any) {
    if (item.projectTypeName === 'All') {
      this.projectTypeselectedItems = this.projectTypeList;

      this.selctAllId = item.id;
    } else {
      if (
        this.projectTypeList.length - 1 ===
        this.projectTypeselectedItems.length
      ) {
        this.projectTypeselectedItems = [
          this.projectTypeList.find(
            (item: any) => item.projectTypeName === 'All'
          ),
          ...this.projectTypeselectedItems,
        ];
      }
      // this.projectTypeList.length - 1 ===
      //   this.projectTypeselectedItems.length &&
      //   (this.projectTypeselectedItems = [
      //     {
      //       id: this.selctAllId,
      //       projectTypeName: 'All',
      //     },
      //     ...this.projectTypeselectedItems,
      //   ]);
    }
  }

  public onDeSelect(item: any) {
    if (item.projectTypeName === 'All') {
      this.projectTypeselectedItems = [];
    } else {
      let cloneProjectTypeselectedItems = deepCopy(
        this.projectTypeselectedItems
      );

      const findAllValue = this.projectTypeselectedItems.findIndex(
        (obj: any) => {
          return obj.projectTypeName === 'All';
        }
      );

      if (findAllValue >= 0) {
        cloneProjectTypeselectedItems.splice(findAllValue, 1);
      }

      this.projectTypeselectedItems = cloneProjectTypeselectedItems;
    }
  }

  onSelection(event: any) {
    this.selectedNode = event;
  }

  //Submit MeteicsTemplate
  onCreateMeteicsTemplate(data: any) {
    data.templateUploadedUserId = this.ssoUserInfo.idTokenClaims.oid;
    data.templateUploadedUserName = this.ssoUserInfo.name;
    data.projectTypes = this.extractedIds;

    const dialogRef = this.dialog.open(ConsentPopupComponent, {
      data: { name: 'Are you sure you want to add this Metric Template?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.service
          .httpRequest(
            '/ee-dashboard/api/v1/metric/template/create',
            'POST',
            data
          )
          .subscribe({
            next: (resp) => {
              const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
                data: {
                  status: 'success',
                  heading: 'Congratulations!',
                  subHeading: 'Your Template Created Successfully.',
                  buttonText: 'BACK HOME',
                },
              });
              dialogRef.afterClosed().subscribe((result) => {
                if (result === 'yes')
                  this.router.navigate(['dashboard/template-selection']);
              });
            },
            error: (error) => {
              const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
                data: {
                  status: 'failure',
                  heading: error.error.message,
                  subHeading: '',
                  buttonText: 'OK',
                },
              });
              dialogRef.afterClosed().subscribe((result) => {});
            },
          });
      }
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
}
