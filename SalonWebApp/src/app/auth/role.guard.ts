import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { Role } from "../shared/models/Enum/Role.enum";

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.user.pipe(
      take(1),
      map(user => {
        const expectedRoles = route.data['roles'] as Role[];
        console.log('RoleGuard expectedRoles: ', expectedRoles);
        console.log('RoleGuard user: ', user);

        if (user && expectedRoles.includes(user.role)) {
          return true;
        }

        // Returnați un UrlTree în cazul în care utilizatorul nu este autentificat sau nu are rolul necesar
        return this.router.parseUrl('/'); // Sau orice altă cale dorită
      })
    );
  }
}
