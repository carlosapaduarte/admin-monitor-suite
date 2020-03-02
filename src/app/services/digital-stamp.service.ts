import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash';

import { ConfigService } from './config.service';
import { UserService } from './user.service';
import { MessageService } from './message.service';

import { Response } from '../models/response';
import { AdminError } from '../models/error';

@Injectable({
  providedIn: 'root'
})
export class DigitalStampService {

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private message: MessageService,
    private config: ConfigService
  ) { }

  generateForAll(): Observable<Array<string>> {
    return this.http.post<any>(this.config.getServer('/stamp/all'), {}, {observe: 'response'}).pipe(
      map(res => {
        if (!res.body || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response> res.body;

        if (response.success !== 1 && response.success !== 0) {
          throw new AdminError(response.success, response.message);
        }

        return <Array<string>> response.result;
      }),
      catchError(err => {
        this.message.show('DIGITAL_STAMP.messages.generate_all_error');
        console.log(err);
        return of(null);
      })
    );
  }

  generateForWebsite(data: any): Observable<boolean> {
    return this.http.post<any>(this.config.getServer('/stamp/website'), data, {observe: 'response'}).pipe(
      map(res => {
        if (!res.body || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response> res.body;

        if (response.success !== 1 && response.success !== 0) {
          throw new AdminError(response.success, response.message);
        }

        return <boolean> response.result;
      }),
      catchError(err => {
        this.message.show('DIGITAL_STAMP.messages.generate_website_error');
        console.log(err);
        return of(null);
      })
    );
  }
}
