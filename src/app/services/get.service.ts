import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, retry, catchError } from 'rxjs/operators';
import * as _ from 'lodash';

import { UserService } from './user.service';
import { MessageService } from './message.service';

import { Response } from '../models/response';
import { AdminError } from '../models/error';
import { User } from '../models/user';
import { Tag } from '../models/tag';
import { Entity } from '../models/entity';
import { Website } from '../models/website';
import { Domain } from '../models/domain';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class GetService {

  constructor(
    private user: UserService,
    private message: MessageService
  ) { }

  listOfUsers(): Observable<Array<User>> {
    return ajax.post(this.getServer('/admin/users/all'), {cookie: this.user.getUserData()}).pipe(
      retry(3),
      map(res => {
        const response = <Response> res.response;

        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <Array<User>> response.result;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }

  listOfTags(): Observable<Array<Tag>> {
    return ajax.post(this.getServer('/admin/tags/all'), {cookie: this.user.getUserData()}).pipe(
      retry(3),
      map(res => {
        const response = <Response> res.response;

        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <Array<Tag>> response.result;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }

  listOfEntities(): Observable<Array<Entity>> {
    return ajax.post(this.getServer('/admin/entities/all'), {cookie: this.user.getUserData()}).pipe(
      retry(3),
      map(res => {
        const response = <Response> res.response;

        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <Array<Entity>> response.result;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }

  listOfWebsites(): Observable<Array<Website>> {
    return ajax.post(this.getServer('/admin/websites/all'), {cookie: this.user.getUserData()}).pipe(
      retry(3),
      map(res => {
        const response = <Response> res.response;

        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <Array<Website>> response.result;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }

  listOfOfficialWebsites(): Observable<Array<Website>> {
    return ajax.post(this.getServer('/admin/websites/allOfficial'), {cookie: this.user.getUserData()}).pipe(
      retry(3),
      map(res => {
        const response = <Response> res.response;

        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }
        
        return <Array<Website>> response.result;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }

  listOfDomains(): Observable<Array<Domain>> {
    return ajax.post(this.getServer('/admin/domains/all'), {cookie: this.user.getUserData()}).pipe(
      retry(3),
      map(res => {
        const response = <Response> res.response;

        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <Array<Domain>> response.result;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }

  listOfOfficialDomains(): Observable<Array<Domain>> {
    return ajax.post(this.getServer('/admin/domains/allOfficial'), {cookie: this.user.getUserData()}).pipe(
      retry(3),
      map(res => {
        const response = <Response> res.response;

        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <Array<Domain>> response.result;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }

  listOfPages(): Observable<Array<Page>> {
    return ajax.post(this.getServer('/admin/pages/all'), {cookie: this.user.getUserData()}).pipe(
      retry(3),
      map(res => {
        const response = <Response> res.response;

        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <Array<Page>> response.result;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }

  websitesWithoutUser(): Observable<Array<Website>> {
    return ajax.post(this.getServer('/admin/websites/withoutUser'), {cookie: this.user.getUserData()}).pipe(
      retry(3),
      map(res => {
        const response = <Response> res.response;

        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <Array<Website>> response.result;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }

  websitesWithoutEntity(): Observable<Array<Website>> {
    return ajax.post(this.getServer('/admin/websites/withoutEntity'), {cookie: this.user.getUserData()}).pipe(
      retry(3),
      map(res => {
        const response = <Response> res.response;

        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <Array<Website>> response.result;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }

  listOfMyMonitorUsers(): Observable<Array<User>> {
    return ajax.post(this.getServer('/admin/users/monitor'), {cookie: this.user.getUserData()}).pipe(
      retry(3),
      map(res => {
        const response = <Response> res.response;

        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <Array<User>> response.result;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }

  websiteCurrentDomain(websiteId: number): Observable<string> {
    return ajax(this.getServer('/admin/websites/currentDomain/' + websiteId)).pipe(
      retry(3),
      map(res => {
        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response> res.response;

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <string> response.result;
      }),
      catchError(err => {
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