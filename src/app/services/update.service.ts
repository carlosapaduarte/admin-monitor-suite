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
export class UpdateService {

  constructor(
    private readonly userService: UserService,
    private readonly message: MessageService,
    private readonly config: ConfigService,
    private readonly http: HttpClient
  ) { }

  user(data: any): Observable<boolean> {
    return this.http.post<any>(this.config.getServer('/user/update'), data, {observe: 'response'}).pipe(
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
        this.message.show('USERS_PAGE.UPDATE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  tag(data: any): Observable<boolean> {
    return this.http.post(this.config.getServer('/tag/update'), data, {observe: 'response'}).pipe(
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
        this.message.show('USERS_PAGE.UPDATE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  copyTag(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();
    return ajax.post(this.config.getServer('/admin/tags/update/copy'), data).pipe(
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
        this.message.show('USERS_PAGE.UPDATE.user_tag.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  entity(data: any): Observable<boolean> {
    return this.http.post<any>(this.config.getServer('/entity/update'), data, {observe: 'response'}).pipe(
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
        this.message.show('ENTITIES_PAGE.UPDATE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  website(data: any): Observable<boolean> {
    return this.http.post<any>(this.config.getServer('/website/update'), data, {observe: 'response'}).pipe(
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
        this.message.show('WEBSITES_PAGE.UPDATE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  domain(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();
    return ajax.post(this.config.getServer('/admin/domains/update'), data).pipe(
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
        this.message.show('PAGES_PAGE.UPDATE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  page(data: any): Observable<boolean> {
    return this.http.post<any>(this.config.getServer('/page/update'), data, {observe: 'response'}).pipe(
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
        this.message.show('PAGES_PAGE.UPDATE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  importPage(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();
    return ajax.post(this.config.getServer('/admin/pages/updateAdminPage'), data).pipe(
      retry(3),
      map(res => {
        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response> res.response;

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <boolean> (response.result > 0);
      }),
      catchError(err => {
        this.message.show('IMPORT.errors.page');
        console.log(err);
        return of(null);
      })
    );
  }

  importWebsite(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();
    return ajax.post(this.config.getServer('/admin/pages/updateAdminWebsite'), data).pipe(
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
        this.message.show('IMPORT.errors.website');
        console.log(err);
        return of(null);
      })
    );
  }

  importTag(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();
    return ajax.post(this.config.getServer('/admin/pages/updateAdminTag'), data).pipe(
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
        this.message.show('IMPORT.errors.tag');
        console.log(err);
        return of(null);
      })
    );
  }

  observatoryPages(pages: Array<any>, pagesId: Array<number>): Observable<boolean> {
    const data = {
      pages: JSON.stringify(pages),
      pagesId: JSON.stringify(pagesId)
    };

    return this.http.post<any>(this.config.getServer('/website/pages/updateObservatory'), data, {observe: 'response'}).pipe(
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
        this.message.show('PAGES_PAGE.UPDATE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  reEvaluateTagWebsites(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();

    return ajax.post(this.config.getServer('/admin/tag/reEvaluate'), data).pipe(
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
        this.message.show('PAGES_PAGE.UPDATE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  reEvaluateEntityWebsites(data: any) : Observable<boolean> {
    data.cookie = this.userService.getUserData();

    return ajax.post(this.config.getServer('/admin/entity/reEvaluate'), data).pipe(
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
        this.message.show('PAGES_PAGE.UPDATE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  reEvaluateWebsitePages(data: any): Observable<boolean> {
    data.cookie = this.userService.getUserData();

    return ajax.post(this.config.getServer('/admin/website/reEvaluate'), data).pipe(
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
        this.message.show('PAGES_PAGE.UPDATE.messages.error');
        console.log(err);
        return of(null);
      })
    );
  }

  crawlerConfig(data: any): Observable<boolean> {
    return this.http.post<any>(this.config.getServer('/crawler/setConfig'), data, {observe: 'response'}).pipe(
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
        this.message.show('CRAWLER_CONFIG.UPDATE.error');
        console.log(err);
        return of(null);
      })
    );
  }
}
