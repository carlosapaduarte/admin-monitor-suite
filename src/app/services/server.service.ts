import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

import { UserService } from './user.service';

@Injectable()
export class ServerService {

  constructor(private http: HttpClient, private user: UserService) { }

  private getServer(): string {
    const host = location.host;

    if (_.startsWith(host, 'localhost')) {
      return 'http://localhost/am_server/';
    } else if (_.startsWith(host, 'accessible-serv.lasige.di.fc.ul.pt')) {
      return 'http://accessible-serv.lasige.di.fc.ul.pt/~jvicente/am_server/';
    }

    return '';
  }

  post(formData: FormData): any {
    return this.http.post(this.getServer(), formData);
  }

  userPost(formData: FormData): any {
    const ssid = this.user.getUserData();

    formData.append('userId', ssid['UserId']);
    formData.append('type', ssid['Type']);
    formData.append('hash', ssid['Unique_Hash']);

    return this.post(formData);
  }
}
