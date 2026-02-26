import { Component, signal } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { NavigationEnd, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay, startWith } from 'rxjs/operators';

// console.log('RUNTIME audience:', environment.auth0.audience);

const ROLES_CLAIM = 'https://capstone.mjarrett/roles';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-capstone');

  isAdmin$: Observable<boolean>;
  isInAdmin$: Observable<boolean>;
  isAdminArea$: Observable<boolean>;

  constructor(
    public auth: AuthService,
    private router: Router,
  ) {
    // check admin token
    this.isAdmin$ = this.auth.idTokenClaims$.pipe(
      map((claims) => ((claims?.[ROLES_CLAIM] as string[] | undefined) ?? []).includes('admin')),
      shareReplay(1),
    );

    // check if on admin route
    this.isInAdmin$ = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url.startsWith('/admin')),
      startWith(this.router.url.startsWith('/admin')),
      shareReplay(1),
    );

    // conditionally render admin header
    this.isAdminArea$ = combineLatest([this.isAdmin$, this.isInAdmin$]).pipe(
      map(([isAdmin, isInAdmin]) => isAdmin && isInAdmin),
      shareReplay(1),
    );

    this.auth.isAuthenticated$.subscribe((v) => console.log('isAuthenticated', v));
    this.auth.error$.subscribe((e) => console.error('Auth0 error', e));
  }
}
