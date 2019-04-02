import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { GetService } from '../../services/get.service';
import { DeleteService } from '../../services/delete.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent implements OnInit, OnDestroy {

  loading: boolean;
  error: boolean;

  sub: Subscription;

  user: string;
  website: string;
  domains: Array<any>;
  activeDomain: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private get: GetService,
    private deleteService: DeleteService,
    private message: MessageService,
    private cd: ChangeDetectorRef
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.user = _.trim(params.user);
      this.website = params.website;

      this.getListOfWebsiteDomains();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private getListOfWebsiteDomains(): void {
    this.get.listOfWebsiteDomains(this.user, this.website)
      .subscribe(domains => {
        if (domains !== null) {
          this.domains = domains;
          this.activeDomain = _.find(this.domains, ['Active', 1]).Url;
        } else {
          this.error = true;
        }

        this.loading = false;
        this.cd.detectChanges();
      });
  }

  deleteDomain(domain): void {
    this.deleteService.domain({domainId: domain})
      .subscribe(success => {
        if (success !== null) {
          this.loading = true;
          this.getListOfWebsiteDomains();
          this.message.show('DOMAINS_PAGE.DELETE.messages.success');
        }
      });
  }
}
