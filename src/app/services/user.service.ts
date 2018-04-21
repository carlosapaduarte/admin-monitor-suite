import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';

import { CookieService } from 'ngx-cookie-service';

import { UserAuthErrorDialogComponent } from '../dialogs/user-auth-error-dialog/user-auth-error-dialog.component';

@Injectable()
export class UserService {

  constructor(private router: Router, private cookieService: CookieService,
    private dialog: MatDialog) { }

  private getEnv(): string {
    const host = location.host;

    if (_.startsWith(host, 'localhost')) {
      return 'localhost';
    } else if (_.startsWith(host, 'accessible-serv.lasige.di.fc.ul.pt')) {
      return 'accessible-serv.lasige.di.fc.ul.pt';
    }

    return '';
  }

  login(data: any): void {
    const host = this.getEnv();
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    this.cookieService.set('SSID', btoa(JSON.stringify(data)), tomorrow, '/', host, false);
  }

  isUserLoggedIn(): boolean {
    return this.cookieService.check('SSID');
  }

  getUserData(): {} {
    return JSON.parse(atob(this.cookieService.get('SSID')));
  }

  logout(location: string = '/'): void {
    const host = this.getEnv();

    this.cookieService.deleteAll('/', host);
    this.router.navigateByUrl(location);
  }

  alertDialog(): void {
    this.dialog.open(UserAuthErrorDialogComponent);
  }
}
