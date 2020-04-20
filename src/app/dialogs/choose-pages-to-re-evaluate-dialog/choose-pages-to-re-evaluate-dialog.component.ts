import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

import { EvaluationService } from '../../services/evaluation.service';

import { BackgroundEvaluationsInformationDialogComponent } from '../background-evaluations-information-dialog/background-evaluations-information-dialog.component';

@Component({
  selector: 'app-choose-pages-to-re-evaluate-dialog',
  templateUrl: './choose-pages-to-re-evaluate-dialog.component.html',
  styleUrls: ['./choose-pages-to-re-evaluate-dialog.component.css']
})
export class ChoosePagesToReEvaluateDialogComponent implements OnInit {

  pages: FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private readonly evaluation: EvaluationService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ChoosePagesToReEvaluateDialogComponent>
  ) {
    this.pages = new FormControl('all', [Validators.required]);
  }

  ngOnInit(): void {
  }

  reEvaluatePages(e: any): void {
    e.preventDefault();

    if (this.data.dialog === 'website') {
      this.evaluation.reEvaluateWebsitePages({ domainId: this.data.info, option: this.pages.value })
        .subscribe(result => {
          if (result) {
            this.openInformationDialog();
          } else {
            alert('Error');
          }
        });
    } else if (this.data.dialog === 'entity') {
      this.evaluation.reEvaluateEntityWebsitePages({ entityId: this.data.info, option: this.pages.value })
        .subscribe(result => {
          if (result) {
            this.openInformationDialog();
          } else {
            alert('Error');
          }
        });
    } else if (this.data.dialog === 'tag') {
      this.evaluation.reEvaluateTagWebsitePages({ tagId: this.data.info, option: this.pages.value })
        .subscribe(result => {
          if (result) {
            this.openInformationDialog();
          } else {
            alert('Error');
          }
        });
    }
    this.dialogRef.close();
  }

  private openInformationDialog(): void {
    const data = {
      width: '40vw',
    };
    this.dialog.open(BackgroundEvaluationsInformationDialogComponent, data);
  }
}
