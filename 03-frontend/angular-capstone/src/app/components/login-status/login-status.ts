import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-status',
  standalone: false,
  templateUrl: './login-status.html',
  styleUrls: ['./login-status.css'],
})
export class LoginStatus {
  constructor(
    public auth: AuthService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  login(): void {
    this.auth.loginWithRedirect(); 
  }

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin } });
  }
}
