import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { MatDialog } from '@angular/material/dialog';

import { EvaluationService } from '../../services/evaluation.service';
import { GetService } from '../../services/get.service';
import { DeleteService } from '../../services/delete.service';
import { MessageService } from '../../services/message.service';

import { BackgroundEvaluationsInformationDialogComponent } from '../../dialogs/background-evaluations-information-dialog/background-evaluations-information-dialog.component';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit, OnDestroy {

  loading: boolean;
  error: boolean;

  sub: Subscription;

  tag: string;
  website: string;
  page: string;

  evaluations: Array<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private evaluation: EvaluationService,
    private get: GetService,
    private deleteService: DeleteService,
    private message: MessageService,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.tag = params.tag;
      this.website = params.website;
      this.page = params.page;
      this.getListOfPageEvaluations();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private getListOfPageEvaluations(): void {
    this.get.listOfPageEvaluations(encodeURIComponent(this.page), this.tag ? 'studies': this.website ? 'monitor' : 'admin')
      .subscribe(evaluations => {
        if (evaluations !== null) {
          this.evaluations = evaluations;
        } else {
          this.error = true;
        }

        this.loading = false;
        this.cd.detectChanges();
      });
  }

  evaluate(): void {
    this.evaluation.reEvaluatePage({ page: this.page })
      .subscribe(result => {
        if (result) {
          const data = {
            width: '40vw',
          };
          this.dialog.open(BackgroundEvaluationsInformationDialogComponent, data);
        } else {
          alert('Error');
        }
      });
  }

  deleteEvaluation(evaluationId: number): void {
    this.deleteService.evaluation({ evaluationId })
      .subscribe(success => {
        if (success !== null) {
          this.loading = true;
          this.getListOfPageEvaluations();
          this.message.show('EVALUATIONS_PAGE.DELETE.messages.success');
        }
      });
  }
}
