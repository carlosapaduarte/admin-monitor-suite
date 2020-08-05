import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { GetService } from '../../../services/get.service';
import { TagEntity } from '../../../models/tag-entity.object';
import { Website } from 'app/models/website.object';
import * as _ from 'lodash';
import { ScoreDistributionDialogComponent } from 'app/dialogs/score-distribution-dialog/score-distribution-dialog.component';
import { ErrorDistributionDialogComponent } from 'app/dialogs/error-distribution-dialog/error-distribution-dialog.component';
import { CorrectionDistributionDialogComponent } from 'app/dialogs/correction-distribution-dialog/correction-distribution-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tag-statistics',
  templateUrl: './tag-statistics.component.html',
  styleUrls: ['./tag-statistics.component.css']
})
export class TagStatisticsComponent implements OnInit {

  @Input('tag') tag: string;

  loading: boolean;
  error: boolean;

  nPages: number;
  nWebsites: number;
  pages: any[];
  tagEntity: TagEntity;

  score: number;

  newest_page: any;
  oldest_page: any;

  thresholdConfig: any;

  websitesWithErrors: number;
  websitesWithErrorsPercentage: string;
  websitesWithoutErrors: number;
  websitesWithoutErrorsPercentage: string;
  websitesWithoutErrorsA: number;
  websitesWithoutErrorsAPercentage: string;
  websitesWithoutErrorsAA: number;
  websitesWithoutErrorsAAPercentage: string;
  websitesWithoutErrorsAAA: number;
  websitesWithoutErrorsAAAPercentage: string;

  constructor(private get: GetService, private dialog: MatDialog, private cd: ChangeDetectorRef) {
    this.thresholdConfig = {
      '0': {color: 'red'},
      '2.5': {color: 'orange'},
      '5': {color: 'yellow'},
      '7.5': {color: 'green'}
    };

    this.score = 0;

    this.nPages = this.nWebsites = 0;

    this.websitesWithErrors = 0;
    this.websitesWithoutErrorsA = 0;
    this.websitesWithoutErrorsAA = 0;
    this.websitesWithoutErrorsAAA = 0;

    this.error = false;
    this.loading = true;
  }

  ngOnInit(): void {
    this.get.listOfTagWebsitePages(this.tag)
      .subscribe(pages => {
        if (pages.length > 0) {
          this.pages = pages;

          this.tagEntity = this.createTagEntity(_.clone(this.pages));
          this.score = this.tagEntity.getScore();

          this.nPages = this.pages.length;
          this.nWebsites = this.tagEntity.websites.length;

          const size = _.size(this.tagEntity.websites);
          this.newest_page = this.tagEntity.websites[0].recentPage;
          this.oldest_page = this.tagEntity.websites[0].oldestPage;

          for (let i = 0 ; i < size ; i++) {
            if (this.tagEntity.websites[i].A !== 0) {
              this.websitesWithoutErrorsA++;
            }

            if (this.tagEntity.websites[i].AA !== 0) {
              this.websitesWithoutErrorsAA++;
            }

            if (this.tagEntity.websites[i].AAA !== 0) {
              this.websitesWithoutErrorsAAA++;
            }

            this.websitesWithoutErrors = this.websitesWithoutErrorsA + this.websitesWithoutErrorsAA + this.websitesWithoutErrorsAAA;
            this.websitesWithErrors = size - this.websitesWithErrors;

            if (this.tagEntity.websites[i].recentPage > this.newest_page) {
              this.newest_page = this.tagEntity.websites[i].recentPage;
            } else if (this.tagEntity.websites[i].oldestPage < this.oldest_page) {
              this.oldest_page = this.tagEntity.websites[i].oldestPage;
            }
          }

          this.websitesWithoutErrors = size - this.websitesWithErrors;

          this.websitesWithErrorsPercentage = ((this.websitesWithErrors / size) * 100).toFixed(1) + '%';
          this.websitesWithoutErrorsPercentage = ((this.websitesWithoutErrors / size) * 100).toFixed(1) + '%';
          this.websitesWithoutErrorsAPercentage = ((this.websitesWithoutErrorsA / size) * 100).toFixed(1) + '%';
          this.websitesWithoutErrorsAAPercentage = ((this.websitesWithoutErrorsAA / size) * 100).toFixed(1) + '%';
          this.websitesWithoutErrorsAAAPercentage = ((this.websitesWithoutErrorsAAA / size) * 100).toFixed(1) + '%';
        } else {
          this.error = true;
        }

        this.loading = false;

        this.cd.detectChanges();
      });
  }

  openScoreDistributionDialog(): void {
    this.dialog.open(ScoreDistributionDialogComponent, {
      data: {
        number: this.tagEntity.websites.length,
        tagEntity: this.tagEntity
      },
      width: '60vw'
    });
  }

  openErrorDistributionDialog(): void {
    this.dialog.open(ErrorDistributionDialogComponent, {
      data: {
        pagesLength: this.pages.length,
        tagEntity: this.tagEntity,
        inTagsPage: true
      },
      width: '80vw'
    });
  }

  openCorrectionDistributionDialog(): void {
    this.dialog.open(CorrectionDistributionDialogComponent, {
      data: {
        pagesLength: this.pages.length,
        tagEntity: this.tagEntity,
        inTagsPage: true
      },
      width: '80vw'
    });
  }

  private createTagEntity(pages: any): TagEntity {
    const newTag = new TagEntity();
    const tmpWebsitesIds = new Array<number>();
    const websites = new Array<any>();
    for (const wb of pages || []) {
      if (!tmpWebsitesIds.includes(wb.WebsiteId)) {
        tmpWebsitesIds.push(wb.WebsiteId);
        websites.push(wb.WebsiteId);
      }
    }
    
    for (const website of websites || []) {
      const newWebsite = this.createWebsite(website, pages);
      newTag.addWebsite(newWebsite);
    }

    return newTag;
  }

  private createWebsite(website: any, _pages: any): Website {
    const newWebsite = new Website();

    const pages = new Array<any>();
    _pages.map((p: any) => {
      if (p.WebsiteId === website) {
        pages.push({
          pageId: p.PageId,
          uri: p.Uri,
          score: parseFloat(p.Score),
          errors: p.Errors,
          tot: p.Tot,
          A: p.A,
          AA: p.AA,
          AAA: p.AAA,
          evaluation_date: p.Evaluation_Date
        });
      }
    });

    for (const page of pages || []) {
      this.addPageToWebsite(newWebsite, page);
    }

    return newWebsite;
  }

  private addPageToWebsite(website: any, page: any): void {
    website.addPage(
      page.score,
      page.errors,
      page.tot,
      page.A,
      page.AA,
      page.AAA,
      page.evaluation_date
    );
  }

}
