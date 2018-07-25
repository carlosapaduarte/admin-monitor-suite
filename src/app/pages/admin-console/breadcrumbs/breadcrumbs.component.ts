import { Component, OnInit ,OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  sub: any;

  users: boolean;
  tags: boolean;
  entities: boolean;
  websites: boolean;
  domains: boolean;
  pages: boolean;
  settings: boolean;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.users = _.includes(event.url, 'users');
        this.tags = _.includes(event.url, 'tags');
        this.entities = _.includes(event.url, 'entities');
        this.websites = _.includes(event.url, 'websites');
        this.domains = _.includes(event.url, 'domains');
        this.pages = _.includes(event.url, 'pages');
        this.settings = _.includes(event.url, 'settings');
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
