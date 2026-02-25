import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { filter, take } from 'rxjs/operators';

const ROLES_CLAIM = 'https://capstone.mjarrett/roles';

@Component({
  selector: 'app-login-callback',
  standalone: false,
  templateUrl: './login-callback.html',
  styleUrls: ['./login-callback.css'],
})
export class LoginCallback implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.user$
      .pipe(
        filter((u) => !!u),
        take(1)
      )
      .subscribe((user: any) => {
        const roles: string[] = user?.[ROLES_CLAIM] ?? [];
        const isAdmin = roles.includes('admin');

        this.router.navigateByUrl(isAdmin ? '/admin' : '/products');
      });
  }
}
