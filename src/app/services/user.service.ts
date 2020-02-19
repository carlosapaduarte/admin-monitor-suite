import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, retry, catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';

import { ConfigService } from './config.service';
import { MessageService } from './message.service';

import { Response } from '../models/response';
import { AdminError } from '../models/error';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private router: Router,
    private http: HttpClient,
    private message: MessageService,
    private config: ConfigService,
    private dialog: MatDialog
  ) { }

  login(username: string, password: string): Observable<boolean> {
    const type = 'nimda';
    return this.http.post<any>(this.config.getServer('/auth/login'), {username, password, type}, {observe: 'response'}).pipe(
      retry(3),
      map(res => {
        if (!res.body || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = new Response(res.body);

        if (response.hasError()) {
          throw new AdminError(response.success, response.message);
        }

        const cookie = response.result;
        const host = this.getEnv();
        const tomorrow = new Date();
        tomorrow.setTime(tomorrow.getTime() + 1 * 86400000);

        sessionStorage.setItem('AMS-username', username);
        localStorage.setItem('AMS-SSID', cookie);
        localStorage.setItem('expires-at', tomorrow.toString());
        //this.cookieService.set('AMS-SSID', btoa(cookie), tomorrow, '/', host, false);
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
    const token = localStorage.getItem('AMS-SSID');
    const expires = localStorage.getItem('expires-at');
    return token && new Date() < new Date(expires);
  }

  getUserData(): {} {
    return localStorage.getItem('AMS-SSID'); //atob(this.cookieService.get('AMS-SSID'));
  }

  getUsername(): string {
    return sessionStorage.getItem('AMS-username');
  }

  logout(location: string = '/'): Observable<boolean> {
    return this.http.post<any>(this.config.getServer('/auth/logout'), {}, {observe: 'response'}).pipe(
      retry(3),
      map(res => {
        if (!res.body || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = new Response(res.body);

        if (response.hasError()) {
          throw new AdminError(response.success, response.message);
        }

        sessionStorage.removeItem('AMS-username');
        localStorage.removeItem('AMS-SSID');
        localStorage.removeItem('expires-at');
        this.router.navigateByUrl(location);
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

  private getEnv(): string {
    return _.split(location.host, ':')[0];
  }
}
