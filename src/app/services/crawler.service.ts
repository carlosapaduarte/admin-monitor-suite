import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, retry, catchError } from 'rxjs/operators';
import * as _ from 'lodash';

import { Response } from '../models/response';
import { AdminError } from '../models/error';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CrawlerService {

  constructor(private config: ConfigService) { }

  callCrawler(domain: string, domainId: number, subDomain: string, max_depth: number, max_pages: number): Observable<any> {
    return ajax.post(this.config.getServer('/admin/crawler/crawl'), {domain, domainId, subDomain, max_depth, max_pages}).pipe(
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
        console.log(err);
        return of(null);
      })
    );
  }
}
