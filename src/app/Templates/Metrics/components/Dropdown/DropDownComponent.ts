import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IRadioQuestion } from '../QuestionInterface';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-dropdown-comp',
  templateUrl: './DropDownComponent.component.html',
  styleUrls: ['./DropDownComponent.component.css', '../style.css'],
})
export class DropDownComponent {
  @Input() questionDetails: IRadioQuestion;
  @Input() disableQuestion: string | boolean;
  @Input() questionIndex: any;
  @Input() isSubmitted: any;

  color: ThemePalette = 'primary';

  dropDownChange(event: any, question: any) {
    question.answerValue = [event.value];
    this.isSubmitted && (question.isValid = !!question.answerValue.length);
  }
}
