import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ICheckboxQuestion } from '../QuestionInterface';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-checkbox-comp',
  templateUrl: './CheckBoxComponent.component.html',
  styleUrls: ['./CheckBoxComponent.component.css', '../style.css'],
})
export class CheckBoxComponent {
  @Input() questionDetails: ICheckboxQuestion;
  @Input() disableQuestion: string | boolean;
  @Input() questionIndex: any;
  @Input() isSubmitted: any;
  color: ThemePalette = 'primary';

  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  constructor() {}
  getAnswer(val: any): boolean {
    return !!this.questionDetails.answerValue
      ? this.questionDetails.answerValue.includes(val)
      : false;
  }

  checkboxSlected(event: any, question: any, obj: any, index: number) {
    //checked true
    if (event.checked) {
      !question.answerValue && (question.answerValue = []);

      !question.answerValue.includes(obj.value) &&
        question.answerValue.push(obj.value);
    } else {
      //uncheck
      question.answerValue.splice(question.answerValue.indexOf(obj.value), 1);
    }

    this.isSubmitted && (question.isValid = !!question.answerValue.length);
  }
}
