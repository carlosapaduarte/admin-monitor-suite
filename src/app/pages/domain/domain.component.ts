import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { GetService } from '../../services/get.service';
import { DeleteService } from '../../services/delete.service';

import { Website } from '../../models/website.object';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.css']
})
export class DomainComponent implements OnInit, OnDestroy {

  loading: boolean;
  error: boolean;

  sub: Subscription;

  user: string;
  domain: string;
  pages: Array<any>;

  websiteObject: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private get: GetService,
    private deleteService: DeleteService,
    private cd: ChangeDetectorRef
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.user = params.user || 'admin';
      this.domain = params.domain;

      this.getListOfDomainPages();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private getListOfDomainPages(): void {
    this.get.listOfDomainPages(this.user, encodeURIComponent(this.domain))
      .subscribe(pages => {
        if (pages !== null) {
          this.pages = _.clone(pages);

          pages = pages.filter(p => p.Score !== null);

          this.websiteObject = new Website();
          for (const page of pages) {
            this.websiteObject.addPage(page.Score, page.Errors, page.Tot, page.A, page.AA, page.AAA, page.Evaluation_Date);
          }
        } else {
          this.error = true;
        }

        this.loading = false;
        this.cd.detectChanges();
      });
  }

  deletePages(pages: number[]): void {
    this.deleteService.pages({pages})
      .subscribe(success => {
        if (success !== null) {
          this.loading = true;
          this.cd.detectChanges();
          this.getListOfDomainPages();
        }
      });
  }
}
