import { Component, OnInit } from '@angular/core';

import { GetService } from '../../services/get.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-websites',
  templateUrl: './websites.component.html',
  styleUrls: ['./websites.component.css']
})
export class WebsitesComponent implements OnInit {

  loading: boolean;
  error: boolean;

  websites: Array<any>;

  constructor(
    private get: GetService,
    private message: MessageService
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit() {
    this.get.listOfWebsites()
      .subscribe(websites => {
        if (websites !== null) {
          this.websites = websites;
        } else {
          this.error = true;
        }

        this.loading = false;
      });
  } 
}
