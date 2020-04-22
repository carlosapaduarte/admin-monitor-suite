import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  sub: any;
  home: string;
  users: string;
  tags: string;
  entities: string;
  websites: string;
  domains: string;
  crawler: string;
  pages: string;
  settings: string;

  constructor(private router: Router) {
    this.sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.home = _.isEqual(_.size(_.split(event.url, '/')), 2) ? 'primary' : 'default';
        this.users = _.includes(event.url, 'users') ? 'primary' : 'default';
        this.tags = _.includes(event.url, 'tags') ? 'primary' : 'default';
        this.entities = _.includes(event.url, 'entities') ? 'primary' : 'default';
        this.websites = _.includes(event.url, 'websites') ? 'primary' : 'default';
        this.domains = _.includes(event.url, 'domains') ? 'primary' : 'default';
        this.crawler = _.includes(event.url, 'crawler') ? 'primary' : 'default';
        this.pages = _.includes(event.url, 'pages') ? 'primary' : 'default';
        this.settings = _.includes(event.url, 'settings') ? 'primary' : 'default';
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
