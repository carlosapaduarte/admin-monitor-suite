import { Component, OnInit } from '@angular/core';

import { GetService } from '../../services/get.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  loading: boolean;
  error: boolean;

  pages: Array<any>;

  constructor(
    private get: GetService,
    private message: MessageService
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.get.listOfPages()
      .subscribe(pages => {
        if (pages !== null) {
          this.pages = pages;
        } else {
          this.error = true;
        }

        this.loading = false;
      });
  }
}
