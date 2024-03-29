import { HTTPService } from 'src/app/service/http.service';
import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { FormBuilder, Validators } from '@angular/forms';
import { ConsentPopupComponent } from 'src/app/common/consentPopup/consentPopup.component';
import { MatDialog } from '@angular/material/dialog';
import { AssessmentControllerURL } from 'src/app/apis/apiurls';
import { ConfirmationPopupComponent } from 'src/app/common/ConfirmationPopup/ConfirmationPopup.component';
import { environment } from 'src/environments/environment';
import { AzureService } from 'src/app/service/azureAuth.service';
import { formatDate } from '@angular/common';
import { MetricsTemplateComponent } from '../../MetricsTemplateComponent';
import { Subject } from 'rxjs';
import { ValidationService } from 'src/app/service/validation.service';

@Component({
  selector: 'app-question-list-metric',
  templateUrl: './question-list.component.html',
  styleUrls: ['../../style.css'],
})
export class QuestionListMetricComponent {
  @Input() flowInforData: any;
  @Input() categoryList: any;
  @Input() disableQuestion: any;
  @Input() originalData: any;
  @Input() isSubmitted: any;
  @Input() assesmentId: any;
  @Input() popupData: any;
  @Input() respMsg: any;
  @Input() displayMode: any;
  @Input() noCallReviewCommentEvent:any


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

  reviewerQuestionComment: any[] = [];
  reviewerQuestionWeightage: any[] = [];
  highWeightOptionIndex = 5;

  currentDate: any;
  savedRatings:any
  ratings : String[] = ['Very Good', 'Good','Acceptable', 'Poor', 'Very Poor', 'NA'];
  selectedRating: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private service: HTTPService,
    public dialog: MatDialog,
    private azureService: AzureService,
    private validationservice:ValidationService

  ) {}
 


  ngOnInit() {
    this.validationservice.savedRatings.subscribe(
      data => 
      {
        if(data){
          //this.reviewerQuestionWeightage = data.payload.reviewerQuestionWeightage;
          this.savedRatings = data.payload.reviewerQuestionWeightage;
          this.validationservice.getSavedComments = data.payload.reviewerQuestionComment
        }
       if (this.savedRatings) {
        console.log(this.categoryList);
        this.validationservice.getSavedRatings= this.savedRatings
        this.categoryList.projectCategory.forEach((category: any) => {
          category.templateQuestionnaire.forEach((question: any) => {
            this.setQuestionRating(question.questionId);
            //this.submitReviewDecision()
          });
        });
      }
      }
    );
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
  setQuestionRating(questionId: number) {
    const review = this.savedRatings.find((review: any) => review.questionId === questionId);
    if (review) {
      const questionDetails = this.getQuestionDetails(questionId);
      console.log(questionDetails);
      if (questionDetails) {
        questionDetails.rating = review.reviewerWeightage;
       // this.reviewerQuestionWeightage.push({questionId: review.questionId, reviewerWeightage: review.rating})
      }
    }
  }
  getQuestionDetails(questionId: number) {
    for (const category of this.categoryList.projectCategory) {
      for (const question of category.templateQuestionnaire) {
        if (question.questionId === questionId) {
          return question;
        }
      }
    }
    return null; // Question not found
  }

  onChange(obj: any, searchValue: number): void {
    if (!!this.displayMode && this.displayMode === 'preview') return;
    this.resetDefault.emit();
    obj.answerOptionIndex = searchValue;
    obj.isValid = true;
    if (searchValue === this.highWeightOptionIndex) {
      (obj.comment = ''), (obj.fileUri = '');
    } else {
      delete obj.comment;
      delete obj.fileUri;
    }
  }

  getCategory(type: string) {
    return this.categoryList.scoreCategories.find(
      (obj: any) => obj.categoryName === type
    ).categoryOptions;
  }

  getCategorywiseScores(categoryName: string) {

    console.log("getScore called:: ",this.categoryList)
    return this.categoryList.categorywiseScores
      ? this.categoryList.categorywiseScores.find(
          (obj: any) => obj.categoryName === categoryName
        )
      : false;
  }

  onCommentChange(e: any, obj: any) {
    if (!!this.displayMode && this.displayMode === 'preview') return;
    this.resetDefault.emit();
    obj.comment = e.target.value;
    this.isSubmitted && this.validateQuestion.emit(obj);
  }

  clearSelectedFile(obj: any): void {
    if (!!this.displayMode && this.displayMode === 'preview') return;
    this.isSubmitted && this.validateQuestion.emit(obj);

    if (obj.fileUri) {
      //api call

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
            delete obj.fileUri;
          },
          error: (err) => {
            console.log('error', err);
          },
          complete: () => console.log('complete'),
        });
    } else {
      delete obj.tempfileUri;
    }

    delete obj.selectedFile;
  }

  commentForm = this.formBuilder.group({
    comment: ['', Validators.required],
  });

  saveReviewComment() {
    if (!!this.displayMode && this.displayMode === 'preview') return;
    if (this.commentForm.valid) {
      const comment = this.commentForm.get('comment')?.value;
      console.log(
        'comment:: ',
        comment,
        ' MetricId id:: ',
        this.categoryList.metricId
      );
      this.callSaveReviewCommentAPI({
        metricId: this.categoryList.metricId,
        reviewerId: this.ssoUserInfo.idTokenClaims.oid,
        reviewerName: this.ssoUserInfo.name,
        comment: comment,
      });
    }
  }

  submitReviewDecision() {
    if (!!this.displayMode && this.displayMode === 'preview') return;
    const questionsWithoutRating = this.categoryList.projectCategory.some((categoryType:any) => {
      return categoryType.templateQuestionnaire.some((questionDetails:any) => {
        return !questionDetails.rating;
      });
    });
    //console.log(questionsWithoutRating);
    if (this.commentForm.valid && !questionsWithoutRating) {
      if(this.validationservice.getSavedRatings) this.reviewerQuestionWeightage = this.validationservice.getSavedRatings;
      if(this.validationservice.getSavedComments) this.reviewerQuestionComment = this.validationservice.getSavedComments;
      const comment = this.commentForm.get('comment')?.value;
      this.callSaveReviewCommentAPI({
        metricId: this.categoryList.metricId,
        reviewerId: this.ssoUserInfo.idTokenClaims.oid,
        reviewerName: this.ssoUserInfo.name,
        comment: comment,
        status: 'REVIEWED',
        reviewerQuestionComment: this.reviewerQuestionComment,
        reviewerQuestionWeightage: this.reviewerQuestionWeightage
      });
    }
  }

  callSaveReviewCommentAPI(reqPayload: any) {
    if (!!this.displayMode && this.displayMode === 'preview') return;
    console.log(reqPayload);
    this.callSaveReviewCommentFun.emit({
      isPopupOpen: true,
      isSaveAction: 'submitReviewApiCall',
      popupData: {
        name: `Are you sure you want to submit review for this metric?`,
        payload: reqPayload,
      },
    });
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

  onRatingChange(e: any, obj: any) {

    this.selectedRating = e.target.value;

    if (!!this.displayMode && this.displayMode === 'preview') return;
    this.resetDefault.emit();
    const existingObjectIndex = this.reviewerQuestionWeightage.findIndex(item => item.questionId === obj.questionId);
    if (existingObjectIndex !== -1) {
      this.reviewerQuestionWeightage[existingObjectIndex].reviewerWeightage = e.target.value;
    } else {
      obj.rating = e.target.value;
      this.reviewerQuestionWeightage.push({ questionId: obj.questionId, reviewerWeightage: obj.rating });
    }
    obj.rating = e.target.value;    
    this.isSubmitted && this.validateQuestion.emit(obj);
  }

}
