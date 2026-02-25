import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-admin-home',
  standalone: false,
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css',
})
export class AdminHome {
  constructor(private auth: AuthService) {
    this.auth.idTokenClaims$.subscribe(c => console.log('ID token claims', c));
  }

}
