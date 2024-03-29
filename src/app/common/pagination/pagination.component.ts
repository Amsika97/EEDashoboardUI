import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  pageSizes = [5, 10, 15];

  @Input() alignment: 'left' | 'center' | 'right' = 'left';

  @Input() config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0,
  };

  @Input() showDirectionLinks: boolean = true;
  @Input() maxSize: number = 7;

  public autoHide: boolean = false;
  public responsive: boolean = false;

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  public labels: any = {
    previousLabel: 'Previous',
    nextLabel: 'Next',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`,
  };

  onSelectItemsPerPage(event: any) {
    this.config.itemsPerPage = parseInt(event.target.value);
    this.pageChange.emit(1);
  }
}
