import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';

import { ScoreDistributionDialogComponent } from '../../../dialogs/score-distribution-dialog/score-distribution-dialog.component';
import { ErrorDistributionDialogComponent } from '../../../dialogs/error-distribution-dialog/error-distribution-dialog.component';

import { Page } from '../../../models/page';

@Component({
  selector: 'app-domain-statistics',
  templateUrl: './domain-statistics.component.html',
  styleUrls: ['./domain-statistics.component.css']
})
export class DomainStatisticsComponent implements OnInit {

  @Input('pages') pages: Array<Page>;

  score: number;

  newest_page: any;
  oldest_page: any;

  thresholdConfig: any;

  pagesWithErrors: number;
  pagesWithErrorsPercentage: string;
  pagesWithoutErrors: number;
  pagesWithoutErrorsPercentage: string;
  pagesWithoutErrorsA: number;
  pagesWithoutErrorsAPercentage: string;
  pagesWithoutErrorsAA: number;
  pagesWithoutErrorsAAPercentage: string;
  pagesWithoutErrorsAAA: number;
  pagesWithoutErrorsAAAPercentage: string;

  constructor(private dialog: MatDialog) {
    this.thresholdConfig = {
      '0': {color: 'red'},
      '2.5': {color: 'orange'},
      '5': {color: 'yellow'},
      '7.5': {color: 'green'}
    };

    this.score = 0;
    this.pagesWithErrors = 0;
    this.pagesWithoutErrorsA = 0;
    this.pagesWithoutErrorsAA = 0;
    this.pagesWithoutErrorsAAA = 0;
  }

  ngOnInit(): void {
    const size = _.size(this.pages);
    this.newest_page = this.pages[0].Evaluation_Date;
    this.oldest_page = this.pages[0].Evaluation_Date;

    for (let i = 0 ; i < size ; i++) {
      if (this.pages[i].A === 0) {
        if (this.pages[i].AA === 0) {
          if (this.pages[i].AAA === 0) {
            this.pagesWithoutErrorsAAA++;
          } else {
            this.pagesWithoutErrorsAA++;
          }
        } else {
          this.pagesWithoutErrorsA++;
        }
      } else {
        this.pagesWithErrors++;
      }

      if (this.pages[i].Evaluation_Date > this.newest_page) {
        this.newest_page = this.pages[i].Evaluation_Date;
      } else if (this.pages[i].Evaluation_Date < this.oldest_page) {
        this.oldest_page = this.pages[i].Evaluation_Date;
      }

      this.score += this.pages[i].Score;
    }

    this.score /= size;

    this.pagesWithoutErrors = size - this.pagesWithErrors;

    this.pagesWithErrorsPercentage = ((this.pagesWithErrors / size) * 100).toFixed(1) + '%';
    this.pagesWithoutErrorsPercentage = ((this.pagesWithoutErrors / size) * 100).toFixed(1) + '%';
    this.pagesWithoutErrorsAPercentage = ((this.pagesWithoutErrorsA / size) * 100).toFixed(1) + '%';
    this.pagesWithoutErrorsAAPercentage = ((this.pagesWithoutErrorsAA / size) * 100).toFixed(1) + '%';
    this.pagesWithoutErrorsAAAPercentage = ((this.pagesWithoutErrorsAAA / size) * 100).toFixed(1) + '%';
  }

  openScoreDistributionDialog(): void {
    this.dialog.open(ScoreDistributionDialogComponent, {
      data: {
        number: this.pages.length,
        pages: this.pages
      },
      width: '60vw'
    });
  }

  openErrorDistributionDialog(): void {
    this.dialog.open(ErrorDistributionDialogComponent, {
      data: {
        pages: this.pages
      },
      width: '60vw'
    });
  }
}
