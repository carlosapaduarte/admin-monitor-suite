import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  getServer(service: string): string {
    return 'http://172.28.128.4:3000' + service;
  }

  getWSServer(namespace: string): string {
    return 'http://172.28.128.4:3000' + namespace;
  }
}
