import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { GetService } from '../../services/get.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit, OnDestroy {

  loading: boolean;
  error: boolean;

  sub: Subscription;

  entity: string;
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
      this.entity = params.entity;

      this.getListOfEntityWebsites();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  refreshWebsites(): void {
    this.loading = true;
    this.getListOfEntityWebsites();
  }

  private getListOfEntityWebsites(): void {
    this.get.listOfEntityWebsites(this.entity)
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
