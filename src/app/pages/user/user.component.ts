import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { GetService } from '../../services/get.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  loading: boolean;
  error: boolean;

  sub: Subscription;

  user: string;
  websites: Array<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private get: GetService,
    private cd: ChangeDetectorRef
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.user = _.trim(params.user);

      this.getListOfUserWebsites();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  refreshWebsites(): void {
    this.loading = true;
    this.getListOfUserWebsites();
  }

  private getListOfUserWebsites(): void {
    this.get.listOfUserWebsites(this.user)
      .subscribe(websites => {
        if (websites !== null) {
          this.websites = websites;
        } else {
          this.error = true;
        }

        this.loading = false;
        this.cd.detectChanges();
      });
  }
}
