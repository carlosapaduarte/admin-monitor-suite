import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { HttpClient } from '@angular/common/http';
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
export class DeleteService {

  constructor(
    private readonly userService: UserService,
    private readonly message: MessageService,
    private readonly config: ConfigService,
    private readonly http: HttpClient
  ) { }

  user(data: any): Observable<boolean> {
    return this.http.post(this.config.getServer('/user/delete'), data, {observe: 'response'}).pipe(
      retry(3),
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
        this.message.show('USERS_PAGE.DELETE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  tag(data: any): Observable<boolean> {
    return this.http.post<any>(this.config.getServer('/tag/delete'), data, {observe: 'response'}).pipe(
      retry(3),
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
        this.message.show('TAGS_PAGE.DELETE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  entity(data: any): Observable<boolean> {
    return this.http.post<any>(this.config.getServer('/entity/delete'), data, {observe: 'response'}).pipe(
      retry(3),
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
        this.message.show('ENTITIES_PAGE.DELETE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  website(data: any): Observable<boolean> {
    return this.http.post<any>(this.config.getServer('/website/delete'), data, {observe: 'response'}).pipe(
      retry(3),
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
        this.message.show('WEBSITES_PAGE.DELETE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  domain(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();
    return ajax.post(this.config.getServer('/admin/domains/delete'), data).pipe(
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
        this.message.show('DOMAINS_PAGE.DELETE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  pages(data: any): Observable<boolean> {
    return this.http.post<any>(this.config.getServer('/page/delete'), data, {observe: 'response'}).pipe(
      retry(3),
      map(res => {
        if (!res.body || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response> res.body;

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <boolean> (response.success === 1);
      }),
      catchError(err => {
        this.message.show('PAGES_PAGE.DELETE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  evaluation(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();
    return ajax.post(this.config.getServer('/admin/evaluations/delete'), data).pipe(
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
        this.message.show('EVALUATIONS_PAGE.DELETE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  crawl(crawlDomainId: any): Observable<boolean> {
    return this.http.post<any>(this.config.getServer('/crawler/delete'), {crawlDomainId}, {observe: 'response'}).pipe(
      retry(3),
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
        this.message.show('CRAWLER_PAGE.DELETE.error');
        console.log(err);
        return of(null);
      })
    );
  }
}
