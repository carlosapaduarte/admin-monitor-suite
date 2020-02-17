import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, retry, catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';

import { ConfigService } from './config.service';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from './message.service';

import { Response } from '../models/response';
import { AdminError } from '../models/error';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private message: MessageService,
    private config: ConfigService,
    private dialog: MatDialog
  ) { }

  login(username: string, password: string): Observable<boolean> {
    const app = 'nimda';
    return ajax.post(this.config.getServer('/session/login'), {username, password, app}).pipe(
      retry(3),
      map(res => {
        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = new Response(res.response);

        if (response.hasError()) {
          throw new AdminError(response.success, response.message);
        }

        const cookie = response.result;
        const host = this.getEnv();
        const tomorrow = new Date();
        tomorrow.setTime(tomorrow.getTime() + 1 * 86400000);

        sessionStorage.setItem('AMS-username', username);
        this.cookieService.set('AMS-SSID', btoa(cookie), tomorrow, '/', host, false);
        this.router.navigateByUrl('/console');
        return true;
      }),
      catchError((err: AdminError) => {
        switch (err.code) {
          case -1: // user doesn't exist
            this.message.show('LOGIN.messages.no_user');
            break;
          case -2: // error, password doesn't match
            this.message.show('LOGIN.messages.password_match');
            break;
          default:
            this.message.show('LOGIN.messages.system_error');
            break;
        }

        console.log(err);
        return of(false);
      })
    );
  }

  isUserLoggedIn(): boolean {
    return this.cookieService.check('AMS-SSID');
  }

  getUserData(): {} {
    return atob(this.cookieService.get('AMS-SSID'));
  }

  getUsername(): string {
    return sessionStorage.getItem('AMS-username');
  }

  logout(location: string = '/'): void {
    sessionStorage.removeItem('AMS-username');
    this.cookieService.delete('AMS-SSID', '/', this.getEnv());
    this.router.navigateByUrl(location);
  }

  private getEnv(): string {
    return _.split(location.host, ':')[0];
  }
}
