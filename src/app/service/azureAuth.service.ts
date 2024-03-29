import { Injectable, Inject } from '@angular/core';
import { deepCopy } from '@angular-devkit/core/src/utils/object';
import { HTTPService } from 'src/app/service/http.service';
import {
  MsalService,
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
} from '@azure/msal-angular';
import {
  AuthenticationResult,
  InteractionStatus,
  PopupRequest,
  RedirectRequest,
  EventMessage,
  EventType,
} from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AzureService {
  RoleList = [
    { userName: 'manojvi@maveric-systems.com', role: 'Admin' },
    { userName: 'manojy@maveric-systems.com', role: 'Admin' },
    {
      userName: 'baranidharand@maveric-systems.com',
      role: 'Reviewer',
    },
    {
      userName: 'arsudab@maveric-systems.com',
      role: 'Reviewer',
    },
    { userName: 'shantanub@maveric-systems.com', role: 'User' },
    {
      userName: 'sutejs@maveric-systems.com',
      role: 'User',
    },
  ];
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  public userSubject: Subject<any> = new Subject<any>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private service:HTTPService
  ) {}

  initCall() {
    this.authService.handleRedirectObservable().subscribe();

    this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal
    this.setLoginDisplay();

    this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.ACCOUNT_ADDED ||
            msg.eventType === EventType.ACCOUNT_REMOVED
        )
      )
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          window.location.pathname = '/';
        } else {
          this.setLoginDisplay();
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
        //auto login
        this.autoLogin();
      });
  }

  autoLogin() {
    //if (!sessionStorage.getItem('currentUser'))
    if (!localStorage.getItem('msal.account.keys')) this.loginRedirect();
  }

  setLoginDisplay() {
    // console.log(
    //   '===getAllAccounts()>',
    //   this.authService.instance.getAllAccounts()
    // );

    if (this.authService.instance.getAllAccounts().length > 0) {
      const data: any = deepCopy(this.authService.instance.getAllAccounts()[0]);
      // data['role'] = !!this.getRole(data) ? this.getRole(data)!.role : 'User';
      //this.userSubject.next(data);
      console.log(data);
      this.setUserDetails(data);
    }

    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in Your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();

    if (
      !activeAccount &&
      this.authService.instance.getAllAccounts().length > 0
    ) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }
  
  loginRedirect() {
    //sessionStorage.setItem('currentUser', 'true');
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  loginPopup() {
    if (this.msalGuardConfig.authRequest) {
      this.authService
        .loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
        });
    } else {
      this.authService
        .loginPopup()
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
        });
    }
  }
  logout(popup?: boolean) {
    // sessionStorage.removeItem('currentUser');
    if (popup) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: '/',
      });
    } else {
      this.authService.logoutRedirect();
    }
  }

  clearSubject() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  public userDetails = {
    emailAddress:'',
    userName:'',
    role: ''
  };
  setUserDetails(userdetails: any) {
    const reqPayload = {
      "userName": userdetails.username,
      "name": userdetails.name,
      "emailAddress": userdetails.username,
      "userFirstAndLastName": userdetails.name,
      "oid": userdetails.idTokenClaims.oid,
      "role": "User"
    }
    this.service.getLoginDetails(`/ee-dashboard/api/v1/user/create/update`, reqPayload)
      .subscribe((data:any)=>{
        this.userDetails = userdetails;
        this.userDetails.userName = userdetails.username
        this.userDetails.emailAddress = userdetails.username
        this.userDetails.role = data.role;
        this.userSubject.next(this.userDetails);
      });
  }

  getUserDetails() {
    return this.userDetails;
  }

  getRole(data: any) {
    console.log(data);
    return this.RoleList.find((roleObj) => {
      roleObj.userName === data.username;
    });
  }
}
