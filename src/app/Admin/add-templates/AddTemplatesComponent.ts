import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddtemplatemodelComponent } from 'src/app/model/addtemplatemodel/addtemplatemodel.component';
import { HTTPService } from '../../service/http.service';
import { Router } from '@angular/router';
import { ConfirmationPopupComponent } from 'src/app/common/ConfirmationPopup/ConfirmationPopup.component';
import { AzureService } from 'src/app/service/azureAuth.service';
import { ConsentPopupComponent } from 'src/app/common/consentPopup/consentPopup.component';
import { BreadcrumbService } from 'xng-breadcrumb';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { PageHeadingService } from 'src/app/service/pageHeader.service';
import { Title } from '@angular/platform-browser';
const ALL = 'All';

@Component({
  selector: 'app-add-templates',
  templateUrl: './add-templates.component.html',
  styleUrls: ['./add-templates.component.css'],
})
export class AddTemplatesComponent implements OnInit {
  ssoUserInfo = {
    name: '',
    role: '',
    username: '',
    idTokenClaims: {
      oid: '',
    },
  };
  modalRef: BsModalRef | undefined;
  previewTemplateData: any;
  savedata: any;
  // formGroup
  addTemplatesForm!: FormGroup;
  selectedNode: any;
  AddTemplatesComponent = false; // Condition for the first label
  jsonValidFlag = false;
  savedataFlag = false;
  // booelan values
  submitted: boolean = false;
  selectedScore: string | undefined; // This variable will store the selected name
  selectedScoreId: number | undefined; // This variable will store the selected ID
  templateUploadedUserId: any;
  templateUploadedUserName: any;
  scoreScaleId: any;
  scoreListAll: any = [];
  onItemSelectBusinessUnitId: any = [];
  pattern = '^[a-zA-Z0-9_ -]{1,50}$';
  selctAllId: any;
  isPresent: boolean = false;
  projectTypeDropdownSettings!: IDropdownSettings;

  requiredField: boolean = false;

  extractedIds: any = [];
  //Project Type
  projectTypeList: any = [];
  projectTypeselectedItems: any = [];
  projectTypedropdownSettings!: IDropdownSettings;

  AddTipsInfo: boolean = false;
  exampleModalLabel: any;
  exampleExistingModalLabel: any;
  formSubmit: boolean = false;
  previewTemplate: boolean = false;
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
    private titleService: Title,
    private cdr: ChangeDetectorRef
  ) {
    this.titleService.setTitle('Create Assessment Template');
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

  ngOnInit() {
    this.pageHeadingService.setPageTitle({
      display: true,
      heading: 'Templates',
      subHeading: 'Manage Templates',
    });
    this.breadcrumbService.set('@addTemplate', 'Create Assessment Template');
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
    this.getScoreList();
    this.getprojectTypes();

    this.addTemplatesForm = this.formBuilder.group({
      scoreScaleId: [[]],
      templateName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(this.pattern),
        ],
      ],
      templateDescription: ['', [Validators.required]],
      templateData: ['', [Validators.required]],
      templateFrequency: ['', [Validators.required]],
    });

    //Project Type
    this.projectTypeDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'projectTypeName',
      /*   selectAllText: 'All',
      unSelectAllText: 'UnSelct All', */
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: false,
    };
  }

  //preview template function
  buttonCallBackFun(event: any, data: any) {
    this.formSubmit = true;
    if (this.projectTypeList.find((p: any) => p.checked)) {
      this.isProjectTypeError = false;
    } else {
      this.isProjectTypeError = true;
    }
    if (
      this.addTemplatesForm.valid &&
      this.projectTypeList.find((p: any) => p.checked)
    ) {
      /*   if (data.projectTypes) {
      for (const item of data.projectTypes) {
        this.extractedIds.push(item.id);
      }
      data.projectTypes = this.extractedIds;
    } */

      // data.projectTypes?.forEach((element: any) => {
      //   if (element.projectTypeName === 'All') {
      //     this.isPresent = true;
      //   }
      // });

      // if (this.isPresent) {
      //   this.extractedIds.push(this.selctAllId);
      //   data.projectTypes = this.extractedIds;
      // } else {
      //   data.projectTypes?.forEach((element: any) => {
      //     this.extractedIds.push(element.id);
      //   });
      //   data.projectTypes = this.extractedIds;
      // }

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

      data.scoreScaleId = '399034273';
      this.service
        .httpRequest('/ee-dashboard/api/v1/template/preview', 'POST', data)
        .subscribe({
          next: (resp) => {
            if (!!resp) {
              this.previewTemplateData = resp;
              this.previewTemplate = true;
              this.breadcrumbService.set('@addTemplate', 'Preview Template');
            }
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
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

  getScoreList() {
    //Select Score List*
    this.service
      .httpRequest('/ee-dashboard/api/v1/scoreScales', 'GET')
      .subscribe((scoreList) => {
        const scoredata: any = scoreList; // Assuming the response is an array
        scoreList = scoredata
          .filter((element: any) => element.name)
          .map((element: any) => ({ name: element.name, id: element.id }));

        this.scoreListAll = scoreList;
      });
  }

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

  onSelectAllProjectType(items: any) {}

  //Select Score List*

  onScoreSelect(event: any) {
    this.scoreScaleId = event.target.value;
  }

  openModal() {
    this.modalRef = this.modalService.show(AddtemplatemodelComponent, {
      initialState: {},
    });
  }

  onSelection(event: any) {
    this.selectedNode = event;
  }
  // Create Assessment Template function

  onCreateTemplate(data: any) {
    data.templateUploadedUserId = this.ssoUserInfo.idTokenClaims.oid;
    data.templateUploadedUserName = this.ssoUserInfo.name;
    data.projectTypes = this.extractedIds;
    data.scoreScaleId = '399034273';

    const dialogRef = this.dialog.open(ConsentPopupComponent, {
      data: {
        name: 'Are you sure you want to add this Assessment Template?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.service
          .httpRequest('/ee-dashboard/api/v1/template/create', 'POST', data)
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
    /* const formArray: FormArray = this.addTemplatesForm.get(
      'projectTypes'
    ) as FormArray;

    if ($event.target.checked) {
      if (formArray.controls) {
        formArray.value.push(projectObj.id);
        formArray.controls.push(new FormControl(projectObj.id));
      } else {
        formArray.controls = [];
        formArray.controls.push(new FormControl(projectObj.id));
      }
    } else {
      let i = 0;
      formArray.controls.forEach((ctrl: any) => {
        if (ctrl.value == $event.target.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
 */
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
