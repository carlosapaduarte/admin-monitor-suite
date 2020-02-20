import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  getServer(service: string): string {
    return 'http://localhost:3000' + service;
  }

  getWSServer(namespace: string): string {
    return 'http://localhost:3001' + namespace;
  }
}
