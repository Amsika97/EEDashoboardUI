import { HTTPService } from 'src/app/service/http.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { FormBuilder, Validators } from '@angular/forms';
import { ConsentPopupComponent } from 'src/app/common/consentPopup/consentPopup.component';
import { MatDialog } from '@angular/material/dialog';
import { AssessmentControllerURL } from 'src/app/apis/apiurls';
import { ConfirmationPopupComponent } from 'src/app/common/ConfirmationPopup/ConfirmationPopup.component';
import { environment } from 'src/environments/environment';
import { AzureService } from 'src/app/service/azureAuth.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['../../style.css'],
})
export class QuestionListComponent {
  @Input() flowInforData: any;
  @Input() categoryList: any;
  @Input() disableQuestion: any;
  @Input() originalData: any;
  @Input() isSubmitted: any;
  @Input() assesmentId: any;
  @Input() popupData: any;
  @Input() respMsg: any;
  @Input() displayMode: any;

  @Output() resetDefault = new EventEmitter();
  @Output() validateQuestion = new EventEmitter();
  @Output() callSaveReviewCommentFun = new EventEmitter();
  @Output() respMsgFun = new EventEmitter();

  ssoUserInfo = {
    name: '',
    role: '',
    username: '',
    idTokenClaims: {
      oid: '',
    },
  };
  ratings : String[] = ['Very Good', 'Good','Acceptable', 'Poor', 'Very Poor','NA'];
  selectedRating: string = '';
  currentDate: any;
  reviewerQuestionComment: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private service: HTTPService,
    public dialog: MatDialog,
    private azureService: AzureService
  ) {}

  ngOnInit() {
    this.currentDate = new Date().toISOString();
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
  }

  // @Input() projectName: any;
  // @Input() businessUnitName: any;
  // @Input() accountName: any;
  // @Input() selectedStep: any;

  onChange(obj: any, searchValue: number, scoreCategory: number): void {
    if (!!this.displayMode && this.displayMode === 'preview') return;
    this.resetDefault.emit();
    obj.answerOptionIndex = searchValue;
    obj.isValid = true;
    if (scoreCategory === (!!obj.extraInfo ? obj.extraInfo.selectedIndex : 0)) {
      if (!!obj.extraInfo) {
        obj.extraInfo.proof === 'comment' && (obj.comment = '');
        obj.extraInfo.proof === 'file' && (obj.fileUri = '');
        obj.extraInfo.proof === 'both' &&
          ((obj.fileUri = ''), (obj.comment = ''));
      }
    } else {
      delete obj.comment;
      delete obj.fileUri;
    }
  }

  getCategorywiseScores(categoryName: string) {

    console.log("getScore called:: ",this.categoryList)
    return this.categoryList.categorywiseScores
      ? this.categoryList.categorywiseScores.find(
          (obj: any) => obj.categoryName === categoryName
        )
      : false;
  }

  getCategory(type: string) {
    return this.categoryList.scoreCategories.find(
      (obj: any) => obj.categoryName === type
    ).categoryOptions;
  }

  onCommentChange(e: any, obj: any) {
    if (!!this.displayMode && this.displayMode === 'preview') return;
    this.resetDefault.emit();
    obj.comment = e.target.value;
    this.isSubmitted && this.validateQuestion.emit(obj);
  }

  onReviewerCommentChange(e: any, obj: any) {
    if (!!this.displayMode && this.displayMode === 'preview') return;
    this.resetDefault.emit();
    const existingObjectIndex = this.reviewerQuestionComment.findIndex(item => item.questionId === obj.questionId);

    if (existingObjectIndex !== -1) {
      this.reviewerQuestionComment[existingObjectIndex].reviewerComment = e.target.value;
    } else {
      obj.reviewerComment = e.target.value;
      this.reviewerQuestionComment.push({ questionId: obj.questionId, reviewerComment: obj.reviewerComment });
    }
    obj.reviewerComment = e.target.value;    
    this.isSubmitted && this.validateQuestion.emit(obj);

  }

  downloadFile(question: any, fileName: string): void {
    if (!!this.displayMode && this.displayMode === 'preview') return;
    this.service.getFileDownLoad(question.fileUri).subscribe({
      next: (data: any) => {
        new Blob([data]);
        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = fileName;
        link.click();
      },
      error: (err: any) => {
        console.log('err', err);
      },
      complete: () => {
        console.log('completeed....');
      },
    });
  }

  clearSelectedFile(obj: any): void {
    if (!!this.displayMode && this.displayMode === 'preview') return;
    this.isSubmitted && this.validateQuestion.emit(obj);

    if (obj.fileUri) {
      //api call

      const dialogRef = this.dialog.open(ConsentPopupComponent, {
        data: { name: 'Are you sure you want to delete this file?' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'yes') {
          this.service
            .httpRequest(
              `${AssessmentControllerURL.deleteFile}?fileName=${
                obj.fileUri.split('/')[obj.fileUri.split('/').length - 1]
              }&folderName=${
                obj.fileUri.split('/')[obj.fileUri.split('/').length - 2]
              }`,
              'delete'
            )
            .subscribe({
              next: (res) => {
                const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
                  data: {
                    status: 'success',
                    heading: 'File Deleted Successfully!',
                    subHeading: '',
                    buttonText: 'OK',
                  },
                });
                dialogRef.afterClosed().subscribe((result) => {
                  console.log('response form popup', result);
                  if (result === 'yes') delete obj.fileUri;
                });
              },
              error: (err) => {
                const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
                  data: {
                    status: 'failure',
                    heading: 'Problem deleting this file!',
                    subHeading: '',
                    buttonText: 'OK',
                  },
                });
                console.log('error', err);
              },
              complete: () => console.log('complete'),
            });
        }
      });
    } else {
      delete obj.tempfileUri;
    }

    delete obj.selectedFile;
  }

  uploadFile(obj: any): void {
    if (!!this.displayMode && this.displayMode === 'preview') return;
    const file: File = obj.selectedFile.target.files[0];
    this.resetDefault.emit();
    if (file) {
      this.isSubmitted && this.validateQuestion.emit(obj);
      const formData = new FormData();
      formData.append('file', file);

      obj.uploadStatus = 'Uploading please wait....';

      this.service
        .httpRequest(
          `${AssessmentControllerURL.uploadFile}?folderName=${
            Date.now() +
            '_' +
            this.categoryList.templateUploadedUserId +
            '_' +
            obj.questionId
          }`,
          'post',
          formData
        )
        .subscribe({
          next: (res: any) => {
            if (res.status === '200') {
              obj.uploadStatus = 'Uploaded successful!!!';
              obj.fileUri = `${
                environment.BASE_URL
              }/ee-dashboard/api/v1/download/${
                res.folderName + '/' + res.filename
              }`;
            }
          },
          error: (err) => {
            obj.uploadStatus = 'Uploaded failed!!!';
          },
          complete: () => {
            delete obj.uploadStatus;
            delete obj.tempfileUri;
            delete obj.selectedFile;
          },
        });
    }
  }

  onFileSelected(event: any, obj: any) {
    if (!!this.displayMode && this.displayMode === 'preview') return;
    obj.selectedFile = event;
    obj.tempfileUri = event.target.files[0].name;
  }

  commentForm = this.formBuilder.group({
    comment: ['', Validators.required],
  });

  saveReviewComment() {
    if (!!this.displayMode && this.displayMode === 'preview') return;
    if (this.commentForm.valid) {
      const comment = this.commentForm.get('comment')?.value;
      console.log('comment:: ', comment, ' asssesment id:: ', this.assesmentId);
      this.callSaveReviewCommentAPI({
        assessmentId: this.assesmentId,
        reviewerId: this.ssoUserInfo.idTokenClaims.oid,
        reviewerName: this.ssoUserInfo.name,
        comment: comment,
      });
    }
  }

  submitReviewDecision() {
    if (!!this.displayMode && this.displayMode === 'preview') return;
    if (this.commentForm.valid) {
      const comment = this.commentForm.get('comment')?.value;

      console.log("List Comment: ",this.reviewerQuestionComment)
      this.callSaveReviewCommentAPI({
        assessmentId: this.assesmentId,
        reviewerId: this.ssoUserInfo.idTokenClaims.oid,
        reviewerName: this.ssoUserInfo.name,
        comment: comment,
        status: 'REVIEWED',
        reviewerQuestionComment: this.reviewerQuestionComment
      });
    }
  }

  returnAssessment(){
    if (!!this.displayMode && this.displayMode === 'preview') return;
      const comment = this.commentForm.get('comment')?.value;

      console.log("List Comment: ",this.reviewerQuestionComment)
      console.log("returned");
      
      this.callSaveReviewCommentAPI({
        assessmentId: this.assesmentId,
        reviewerId: this.ssoUserInfo.idTokenClaims.oid,
        reviewerName: this.ssoUserInfo.name,
        comment: comment,
        status: 'RETURNED',
        reviewerQuestionComment: this.reviewerQuestionComment
      });
    
  }

  callSaveReviewCommentAPI(reqPayload: any) {
    if (!!this.displayMode && this.displayMode === 'preview') return;
    console.log(reqPayload);
    if(reqPayload.status === 'RETURNED' ){
      console.log("returned");
      
      this.callSaveReviewCommentFun.emit({
        isPopupOpen: true,
        isSaveAction: 'returnApiCall',
        popupData: {
          name: `Are you sure you want to return the assessment template?`,
          payload: reqPayload,
        },
      });
    }
    else{
    this.callSaveReviewCommentFun.emit({
      isPopupOpen: true,
      isSaveAction: 'submitReviewApiCall',
      popupData: {
        name: `Are you sure you want to submit review for this assessment?`,
        payload: reqPayload,
      },
    });
  }
  }
}
