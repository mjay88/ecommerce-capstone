import { Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { combineLatest, map, take } from 'rxjs';

const ROLES_CLAIM = 'https://capstone.mjarrett/roles';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanMatch {
  constructor(private auth: AuthService, private router: Router) {}

  canMatch(route: Route, segments: UrlSegment[]) {
    const attemptedUrl = '/' + segments.map(s => s.path).join('/'); // e.g. /admin/reports/purchases

    return combineLatest([this.auth.isAuthenticated$, this.auth.idTokenClaims$]).pipe(
      take(1),
      map(([isAuthed, claims]) => {

        if (!isAuthed) {
          // Force login and come back to whatever admin url they tried to hit
          this.auth.loginWithRedirect({ appState: { target: attemptedUrl } });
          return false;
        }

        const roles = (claims?.[ROLES_CLAIM] as string[] | undefined) ?? [];
        const isAdmin = roles.includes('admin');

        if (!isAdmin) {
          this.router.navigateByUrl('/products');
          return false;
        }

        return true;
      })
    );
  }
}
