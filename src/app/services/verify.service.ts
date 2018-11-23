import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, retry, catchError, delay } from 'rxjs/operators';
import * as _ from 'lodash';

import { ConfigService } from './config.service';
import { UserService } from './user.service';
import { MessageService } from './message.service';

import { Response } from '../models/response';
import { AdminError } from '../models/error';

@Injectable({
  providedIn: 'root'
})
export class VerifyService {

  constructor(
    private user: UserService,
    private message: MessageService,
    private config: ConfigService
  ) { }

  userExists(email: string): Observable<boolean> {
    return ajax(this.config.getServer('/admin/users/exists/' + email)).pipe(
      retry(3),
      map(res => {
        const response = <Response> res.response;

        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return response.result ? { 'notTakenEmail': true } : null;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }

  tagNameExists(name: string): Observable<boolean> {
    return ajax(this.config.getServer('/admin/tags/exists/' + name)).pipe(
      retry(3),
      map(res => {
        const response = <Response> res.response;

        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return response.result ? { 'notTakenName': true } : null;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }

  entityShortNameExists(name: string): Observable<boolean> {
    return ajax(this.config.getServer('/admin/entities/exists/shortName/' + name)).pipe(
      retry(3),
      map(res => {
        const response = <Response> res.response;

        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return response.result ? { 'notTakenName': true } : null;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }

  entityLongNameExists(name: string): Observable<boolean> {
    return ajax(this.config.getServer('/admin/entities/exists/longName/' + name)).pipe(
      retry(3),
      map(res => {
        const response = <Response> res.response;

        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return response.result ? { 'notTakenName': true } : null;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }

  websiteNameExists(name: string): Observable<boolean> {
    return ajax(this.config.getServer('/admin/websites/exists/' + name)).pipe(
      retry(3),
      map(res => {
        const response = <Response> res.response;

        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return response.result ? { 'notTakenName': true } : null;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }

  domainExists(domain: string): Observable<boolean> {
    domain = encodeURIComponent(domain);
    return ajax(this.config.getServer('/admin/domains/exists/' + domain)).pipe(
      retry(3),
      map(res => {
        const response = <Response> res.response;

        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return response.result ? { 'notTakenDomain': true } : null;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }
}
