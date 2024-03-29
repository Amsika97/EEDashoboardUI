import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IRadioQuestion } from '../QuestionInterface';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-textarea-comp',
  templateUrl: './TextAreaComponent.component.html',
  styleUrls: ['./TextAreaComponent.component.css', '../style.css'],
})
export class TextAreaComponent {
  @Input() questionDetails: IRadioQuestion;
  @Input() disableQuestion: string | boolean;
  @Input() questionIndex: any;
  @Input() isSubmitted: any;
  color: ThemePalette = 'primary';

  textChange(event: any, question: any) {
    if (
      question.valueType === 'NUMBER' &&
      /^[0-9]*(\.[0-9]{0,2})?$/.test(event.target.value)
    ) {
      this.updateValue(event.target.value, question);
    } else if (question.valueType === 'TEXT') {
      this.updateValue(event.target.value, question);
    } else {
      if (!!event.target.value.length) {
        question.answerValue = [question.answerValue];
      } else {
        question.answerValue = [''];
      }
    }
  }

  updateValue(value: any, question: any) {
    question.answerValue = [value];
    this.isSubmitted && (question.isValid = !!value.length);
  }
}
