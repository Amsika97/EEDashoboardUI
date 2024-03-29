import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.css'],
})
export class InputSearchComponent {
  @Output() searchEvent = new EventEmitter<string>();
  @Output() clearEvent = new EventEmitter();

  buttonDisable: boolean = true;
  searchTextModal = '';
  minChar = 3;
  onSearchChange(event: any): void {
    this.checkforbuttonStatus();
    if (event.target.value === '') this.clearEvent.emit();
  }

  checkforbuttonStatus() {
    if (this.searchTextModal.length < this.minChar) this.buttonDisable = true;
    else this.buttonDisable = false;
  }
  OnSearch() {
    if (this.searchTextModal.length >= this.minChar)
      this.searchEvent.emit(this.searchTextModal);
  }

  clearSearch() {
    this.searchTextModal = '';
    this.checkforbuttonStatus();
    this.clearEvent.emit();
  }
  constructor(private router: Router) {}
  @Input() textPlaceHolder = ' ';
}
