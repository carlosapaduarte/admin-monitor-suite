import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { GetService } from '../../services/get.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit, OnDestroy {

  loading: boolean;
  error: boolean;

  sub: Subscription;

  user: string;
  tag: string;
  websites: Array<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private get: GetService,
    private message: MessageService
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.user = _.trim(params.user);
      this.tag = params.tag;

      this.get.listOfTagWebsites(this.user, this.tag)
        .subscribe(websites => {
          if (websites !== null) {
            this.websites = websites;
          } else {
            this.error = true;
          }

          this.loading = false;
        });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}