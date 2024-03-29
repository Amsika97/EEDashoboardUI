import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IRadioQuestion } from '../QuestionInterface';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-radio-comp',
  templateUrl: './RadioComponent.component.html',
  styleUrls: ['./RadioComponent.component.css', '../style.css'],
})
export class RadioComponent {
  @Input() questionDetails: IRadioQuestion;
  @Input() disableQuestion: string | boolean;
  @Input() questionIndex: any;
  @Input() isSubmitted: any;

  color: ThemePalette = 'primary';

  // @Output() radioCallbackEvent = new EventEmitter<{
  //   event: any;
  //   question: any;
  // }>();

  radioChange(event: any, question: any) {
    question.answerValue = [event.value];
    this.isSubmitted && (question.isValid = !!question.answerValue.length);
    //this.radioCallbackEvent.emit({ event, question });
  }
}
