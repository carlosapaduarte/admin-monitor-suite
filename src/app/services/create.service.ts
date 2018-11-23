import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, retry, catchError } from 'rxjs/operators';
import * as _ from 'lodash';

import { ConfigService } from './config.service';
import { UserService } from './user.service';
import { MessageService } from './message.service';

import { Response } from '../models/response';
import { AdminError } from '../models/error';

@Injectable({
  providedIn: 'root'
})
export class CreateService {

  constructor(
    private user: UserService,
    private message: MessageService,
    private config: ConfigService
  ) { }

  newUser(data: any): Observable<boolean> {
    data.cookie = this.user.getUserData();
    return ajax.post(this.config.getServer('/admin/users/create'), data).pipe(
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
        this.message.show('USERS_PAGE.ADD.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  newTag(data: any): Observable<boolean> {
    data.cookie = this.user.getUserData();
    return ajax.post(this.config.getServer('/admin/tags/create'), data).pipe(
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
        this.message.show('TAGS_PAGE.ADD.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  newEntity(data: any): Observable<boolean> {
    data.cookie = this.user.getUserData();
    return ajax.post(this.config.getServer('/admin/entities/create'), data).pipe(
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
        this.message.show('ENTITIES_PAGE.ADD.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  newWebsite(data: any): Observable<boolean> {
    data.cookie = this.user.getUserData();
    return ajax.post(this.config.getServer('/admin/websites/create'), data).pipe(
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
        this.message.show('WEBSITES_PAGE.ADD.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  newDomain(data: any): Observable<boolean> {
    data.cookie = this.user.getUserData();
    return ajax.post(this.config.getServer('/admin/domains/create'), data).pipe(
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
        this.message.show('DOMAINS_PAGE.ADD.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  newPages(data: any): Observable<boolean> {
    data.cookie = this.user.getUserData();
    return ajax.post(this.config.getServer('/admin/pages/create'), data).pipe(
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
        this.message.show('PAGES_PAGE.ADD.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }
}
