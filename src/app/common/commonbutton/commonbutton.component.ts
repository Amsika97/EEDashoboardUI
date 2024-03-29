import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-commonbutton',
  templateUrl: './commonbutton.component.html',
  styleUrls: ['./commonbutton.component.css'],
})
export class CommonbuttonComponent {
  constructor(private router: Router) {}
  @Output() buttoncallbackEvent = new EventEmitter<string>();
  @Input() buttonText = ' ';
  @Input() stylesObj = {};

  onButtonClick(event: any) {
    this.buttoncallbackEvent.emit(event);
  }
}
