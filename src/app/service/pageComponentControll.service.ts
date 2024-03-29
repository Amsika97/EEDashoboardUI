import { Injectable, Inject } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageComponentService {
  public showBreadCrumb: Subject<any> = new Subject<any>();
  public scrollToBottom: Subject<any> = new Subject<any>();
  public scrollPercentage: BehaviorSubject<number> = new BehaviorSubject(0);

  displayBreadCrumb(val: any) {
    this.showBreadCrumb.next(val);
  }

  pageScroll(val: any) {
    this.scrollToBottom.next(val);
  }

  setPageScrollPercentage(val: any) {
    this.scrollPercentage.next(val);
  }

  getPageScrollPercentage() {
    this.scrollPercentage.asObservable();
  }
}
