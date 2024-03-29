import { Injectable, Inject } from '@angular/core';
import { deepCopy } from '@angular-devkit/core/src/utils/object';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PageHeadingService {
  public pageHeadingSubject: Subject<any> = new Subject<any>();

  constructor() {}

  public pageHeadingDetails: any;
  setPageTitle(obj: any) {
    this.pageHeadingSubject.next(obj);
    this.pageHeadingDetails = obj;
  }

  getPageTitle() {
    return this.pageHeadingDetails;
  }
}
