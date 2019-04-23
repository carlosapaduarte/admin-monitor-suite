import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, retry, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
import {User} from '../models/user';
import {Response} from '../models/response';
import {AdminError} from '../models/error';
import {ConfigService} from './config.service';
import {Domain} from '../models/domain';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CrawlerService {

  constructor(
    private user: UserService,
    private config: ConfigService
  ) { }

  callCrawler(domain: string, max_depth: number, max_pages: number): Observable<string[]> {
    return ajax.post(this.config.getServer('/admin/page/crawler'), {domain, max_depth, max_pages}).pipe(
      retry(3),
      map(res => {
        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response> res.response;

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <string[]> response.result;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }
}
