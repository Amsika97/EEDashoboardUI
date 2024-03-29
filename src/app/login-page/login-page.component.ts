import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HTTPService } from '../service/http.service';
import { Router } from '@angular/router';
import { AzureService } from '../service/azureAuth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  constructor(
    private fbr: FormBuilder,
    private service: HTTPService,
    private router: Router,
    private azureService: AzureService
  ) {
    sessionStorage.removeItem('userData');
  }
  loginDetails = this.fbr.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  loginMessage: string = '';
  submitLoginForm() {
    if (this.loginDetails.valid) {
      this.service
        .login(
          `/ee-dashboard/api/v1/user/login/${this.loginDetails.value.email}/${this.loginDetails.value.password}`,
          this.loginDetails.value
        )
        .subscribe({
          next: (response: any) => {
            if (response.loginMessage === 'login_success') {
              const userData = {
                name: response.userName,
                role: response.role,
                username: response.userFirstAndLastName,
                idTokenClaims: { oid: response.oid },
              };
              sessionStorage.setItem('userData', JSON.stringify(userData));
              this.router.navigateByUrl('/dashboard');
              this.azureService.setUserDetails(userData);
            }
            this.loginMessage = 'Invalid credentials';
          },
          error: (error) => {
            console.log(error);
            this.loginMessage = 'Something went wrong';
          },
        });
    }
  }
}
