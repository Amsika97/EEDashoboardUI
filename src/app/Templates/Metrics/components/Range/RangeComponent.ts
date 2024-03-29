import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import { IRangeQuestion } from '../QuestionInterface';

@Component({
  selector: 'app-range-comp',
  templateUrl: './RangeComponent.component.html',
  styleUrls: ['./RangeComponent.component.css', '../style.css'],
})
export class RangeComponent {
  @Input() questionDetails: IRangeQuestion;
  @Input() disableQuestion: string | boolean;
  @Input() questionIndex: any;
  @Input() isSubmitted: any;

  color: ThemePalette = 'primary';

  formatLabelPercentage(value: number): string {
    return `${value}%`;
  }

  formatLabel(value: number): string {
    return `${value}`;
  }

  onInputChange(event: any, question: any) {
    question.answerValue = [+event.target.value];
    this.isSubmitted && (question.isValid = !!question.answerValue.length);
  }
}
