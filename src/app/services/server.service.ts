import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

import { UserService } from './user.service';

@Injectable()
export class ServerService {

  constructor(private http: HttpClient, private user: UserService) { }

  private getServer(service: string): string {
    const host = location.host;

    if (_.startsWith(host, 'localhost')) {
      return 'http://localhost:3000' + service;
    } else if (_.startsWith(host, 'accessible-serv.lasige.di.fc.ul.pt')) {
      return 'http://accessible-serv.lasige.di.fc.ul.pt/~jvicente/am_server/';
    }

    return '';
  }

  get(service: string): any {
    return this.http.get(this.getServer(service));
  }

  post(service: string, formData: any): any {
    return this.http.post(this.getServer(service), formData);
  }

  userPost(service: string, formData: any): any {
    if (formData) {
      formData.cookie = this.user.getUserData();
    } else {
      formData = {
        cookie: this.user.getUserData()
      };
    }
    return this.post(service, formData);
  }
}
