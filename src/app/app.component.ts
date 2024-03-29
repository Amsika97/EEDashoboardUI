import { UserDetailPopupComponent } from './common/UserDetailPopup/UserDetailPopup.component';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AzureService } from './service/azureAuth.service';
import { PageComponentService } from './service/pageComponentControll.service';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('pageHeader') pageHeader: ElementRef;
  @ViewChild('pageContainer') pageContainer: ElementRef;
  @ViewChild('pageFooter') pageFooter: ElementRef;
  @ViewChild('topContainer') topContainer: ElementRef;

  title = 'EE-Dashboard';
  domain = '';
  login: any;
  preloader = true;
  disableSidebar = false;
  showBreadCrumb = false;
  innerContHeight = 400;

  constructor(
    private azureService: AzureService,
    public dialog: MatDialog,
    private router: Router,
    private pageComponentService: PageComponentService
  ) {
    this.domain = window.location.hostname;
    this.router.events
      .pipe(
        filter((event): event is NavigationStart | NavigationEnd => {
          return (
            event instanceof NavigationStart || event instanceof NavigationEnd
          );
        })
      )
      .subscribe((event: NavigationStart | NavigationEnd) => {
        this.getContainerHeight();
        this.pageComponentService.displayBreadCrumb(true);

        if (event instanceof NavigationEnd) {
          this.disableSidebar = event.url.includes('/login');
        }
      });
  }

  ngAfterViewInit() {
    this.getContainerHeight();
  }

  getContainerHeight() {
    setTimeout(() => {
      this.innerContHeight =
        this.topContainer.nativeElement.getBoundingClientRect().height -
        (this.pageHeader.nativeElement.getBoundingClientRect().height +
          this.pageFooter.nativeElement.getBoundingClientRect().height);
    }, 50);
  }

  @HostListener('scroll', ['$event'])
  scrollHandler(event: any) {
    let winScroll = event.currentTarget.scrollTop;
    let height =
      event.currentTarget.scrollHeight - event.currentTarget.clientHeight;
    let scrolled = (winScroll / height) * 100;

    this.pageComponentService.setPageScrollPercentage(scrolled);
  }

  ngOnInit(): void {
    this.pageComponentService.showBreadCrumb.subscribe((val) => {
      this.showBreadCrumb = val;
    });

    this.pageComponentService.scrollToBottom.subscribe((val) => {
      this.pageContainer.nativeElement.scrollTop =
        val === 'bottom'
          ? this.pageContainer.nativeElement.scrollHeight
          : val === 'top'
          ? 0
          : 0;
    });

    if (
      this.domain !== 'localhost' &&
      !window.location.href.includes('login')
    ) {
      sessionStorage.removeItem('userData');
      this.azureService.initCall();
    } else {
      const sessionData = sessionStorage.getItem('userData');
      if (!!sessionData)
        setTimeout(() => {
          this.azureService.setUserDetails(JSON.parse(sessionData));
        });
      else this.openUserDetails();
      this.preloaderHide();
    }

    this.azureService.userSubject.subscribe((data) => {
      this.preloaderHide();
    });
  }

  preloaderHide() {
    this.preloader = false;
  }

  ngOnDestroy(): void {
    this.azureService.clearSubject();
  }

  openUserDetails() {
    if (window.location.href.includes('login')) {
      this.router.navigateByUrl('/login');
    } else {
      const dialogRef = this.dialog.open(UserDetailPopupComponent);
      dialogRef.afterClosed().subscribe((result) => {
        if (!!result && result !== 'no') {
          sessionStorage.setItem('userData', JSON.stringify(result));
          this.router.navigateByUrl('/dashboard');
          this.azureService.setUserDetails(result);
        }
      });
    }
  }
}
