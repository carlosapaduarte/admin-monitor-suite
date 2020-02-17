import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';

import { ConfigService } from './config.service';
import { UserService } from './user.service';
import { MessageService } from './message.service';

import { Response } from '../models/response';
import { AdminError } from '../models/error';

import { AddPagesErrorsDialogComponent } from '../dialogs/add-pages-errors-dialog/add-pages-errors-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CreateService {

  constructor(
    private http: HttpClient,
    private user: UserService,
    private message: MessageService,
    private config: ConfigService,
    private dialog: MatDialog
  ) { }

  newUser(data: any): Observable<boolean> {
    return this.http.post<any>(this.config.getServer('/user/create'), data, {observe: 'response'}).pipe(
      map(res => {
        if (!res.body || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response> res.body;

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
      map(res => {
        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response> res.response;

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message, 'NORMAL', response.errors, response.result);
        }

        return <boolean> response.result;
      }),
      catchError(err => {
        console.log(err);
        if (err.code === 0) {
          this.dialog.open(AddPagesErrorsDialogComponent, {
            data: err.errors
          });
        } else {
          this.message.show('PAGES_PAGE.ADD.messages.error');
        }
        return of(null);
      })
    );
  }
}
