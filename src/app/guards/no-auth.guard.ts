import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from '../services/user.service';

@Injectable()
export class NoAuthGuard implements CanActivate {

  constructor(private router: Router, private user: UserService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

  	const login = !this.user.isUserLoggedIn();

  	if (!login) {
  		this.router.navigateByUrl('/console');
  	}

    return login;
  }
}
