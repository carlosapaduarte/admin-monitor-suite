import { Injectable } from '@angular/core';
import {UserService} from './user.service';
import {ConfigService} from './config.service';
import {Observable, of} from 'rxjs';
import {ajax} from 'rxjs/ajax';
import {catchError, map, retry} from 'rxjs/operators';
import {AdminError} from '../models/error';
import {Response} from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class OpenDataService {
  constructor(
    private user: UserService,
    private config: ConfigService
  ) {
  }

  sendOpenDataFile(file: string): Observable<boolean> {
    return ajax.post(this.config.getServer('/admin/page/crawler'), {file, cookie: this.user.getUserData()}).pipe(
      retry(3),
      map(res => {
        if (!res.response || res.status === 404) {
          throw new AdminError(404, 'Service not found', 'SERIOUS');
        }

        const response = <Response>res.response;

        if (response.success !== 1) {
          throw new AdminError(response.success, response.message);
        }

        return <boolean>response.result;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    );
  }
}
