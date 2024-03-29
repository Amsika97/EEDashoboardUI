import {
  Component,
  Input,
  Output,
  EventEmitter,
  isDevMode,
} from '@angular/core';
import { AzureService } from 'src/app/service/azureAuth.service';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { filter } from 'rxjs';
import { HTTPService } from 'src/app/service/http.service';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  useDetail: any = {
    name: 'Local Test',
    userName: 'localtest@maveric-systems.com',
    role: 'User',
  };

  domain = '';
  lastLogin: any;
  showUser: boolean = false;
  @Output() openUserDetails = new EventEmitter();
  constructor(
    private userDetailsService: AzureService,
    private router: Router,
    private service: HTTPService
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
        if (event instanceof NavigationStart) {
        }

        if (event instanceof NavigationEnd) {
          this.showUser = event.url.includes('/login');
        }
      });
  }

  ngOnInit(): void {
    this.userDetailsService.userSubject.subscribe((data) => {
      this.useDetail = data;
      this.useDetail.oid = data.idTokenClaims.oid;
      this.useDetail.emailAddress = data.userName;
      this.useDetail.userName = data.userName;
      this.useDetail.role = data.role;
      sessionStorage.setItem('userInfo', JSON.stringify(data));
      this.service
        .getLoginDetails(
          `/ee-dashboard/api/v1/user/create/update`,
          this.useDetail
        )
        .subscribe((data: any) => {
          this.lastLogin =
            data.lastLoginTime.split('|')[0].split('-').join('/') +
            ' | ' +
            data.lastLoginTime.split('|')[2].split(':')[0] +
            ':' +
            data.lastLoginTime.split('|')[2].split(':')[1];
        });
    });
  }
  public createInititals(str: string): string {
    let initials = '';
    str.split(' ').forEach((val) => {
      initials += val.charAt(0).toUpperCase();
    });
    return initials;
  }

  login() {
    this.userDetailsService.loginRedirect();
  }

  logout() {
    this.userDetailsService.logout();
  }

  openUserPopup() {
    if (isDevMode() || window.location.hostname === 'localhost') {
      this.openUserDetails.emit();
    }
  }
}
