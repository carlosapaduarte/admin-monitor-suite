import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, retry, catchError } from 'rxjs/operators';
import * as _ from 'lodash';

import { UserService } from './user.service';
import { MessageService } from './message.service';

import { Response } from '../models/response';
import { AdminError } from '../models/error';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(
    private userService: UserService,
    private message: MessageService
  ) { }

  user(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();
    return ajax.post(this.getServer('/admin/users/update'), data).pipe(
      retry(3),
      map(res => {
        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response> res.response;

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <boolean> response.result;
      }),
      catchError(err => {
        this.message.show('USERS_PAGE.UPDATE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  entity(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();
    return ajax.post(this.getServer('/admin/entities/update'), data).pipe(
      retry(3),
      map(res => {
        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response> res.response;

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <boolean> response.result;
      }),
      catchError(err => {
        this.message.show('ENTITIES_PAGE.UPDATE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  private getServer(service: string): string {
    const host = location.host;
    return 'http://' + _.split(host, ':')[0] + ':3000' + service;
  }
}