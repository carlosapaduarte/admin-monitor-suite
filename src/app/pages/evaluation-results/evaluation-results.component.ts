import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { EvaluationService } from '../../services/evaluation.service';

@Component({
  selector: 'app-evaluation-results',
  templateUrl: './evaluation-results.component.html',
  styleUrls: ['./evaluation-results.component.css']
})
export class EvaluationResultsComponent implements OnInit, OnDestroy {

  sub: Subscription;

  loading: boolean;
  error: boolean;

  eval: any;
  url: string;
  evaluation_id: number;

  n_cols: number;
  colspan: number;

  thresholdConfig: any;

  constructor(
    private evaluation: EvaluationService,
    private route: ActivatedRoute,
    private location: Location,
    private cd: ChangeDetectorRef
  ) {
    this.thresholdConfig = {
      '0': {color: 'red'},
      '2.5': {color: 'orange'},
      '5': {color: 'yellow'},
      '7.5': {color: 'green'}
    };

    this.loading = true;
    this.error = false;

    if (window.innerWidth < 960) {
      this.n_cols = 1;
      this.colspan = 1;
    } else {
      this.n_cols = 3;
      this.colspan = 2;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    if (event.target.innerWidth < 960) {
      this.n_cols = 1;
      this.colspan = 1;
    } else {
      this.n_cols = 3;
      this.colspan = 2;
    }
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.evaluation_id = params.evaluation_id;
      this.url = params.page;
      const userType = params.tag ? 'studies' : 'monitor';

      if (this.evaluation_id) {
        this.evaluation.getEvaluation(this.url, this.evaluation_id)
          .subscribe(data => {
            if (!data) {
              this.error = true;
            } else {
              this.eval = data;
              this.eval.metadata.url = decodeURIComponent(this.eval.metadata.url);
            }

            this.loading = false;
            this.cd.detectChanges();
          });
      } else {
        this.evaluation.getUserPageEvaluation(this.url, userType)
          .subscribe(data => {
            if (!data) {
              this.error = true;
            } else {
              this.eval = data;
              this.eval.metadata.url = decodeURIComponent(this.eval.metadata.url);
            }

            this.loading = false;
            this.cd.detectChanges();
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  evaluate(): void {
    this.loading = true;

    this.evaluation.evaluateUrl(this.url)
      .subscribe(data => {
        if (!data) {
          this.error = true;
        } else {
          this.eval = data;
        }

        this.loading = false;
      });
  }

  getTabsNames(): Array<string> {
    return _.keys(this.eval.tabs);
  }

  downloadEvaluation(): void {
    this.evaluation.downloadCSV();
  }

  goBack(): Array<string> {
    const path = this.location.path();
    let segments = _.split(path, '/');
    segments[0] = '/console';
    segments.splice(1, 1);
    segments.splice(_.size(segments) - 1, 1);
    segments = _.map(segments, s => decodeURIComponent(s));

    return segments;
  }
}
