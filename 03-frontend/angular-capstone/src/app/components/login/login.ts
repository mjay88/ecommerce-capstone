import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  constructor(private auth: AuthService) {}

  signIn(): void {
    this.auth.loginWithRedirect(); 
  }
}
