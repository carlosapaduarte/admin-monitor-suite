import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

import { ReEvaluateWebsitePagesProgressDialogComponent } from '../re-evaluate-website-pages-progress-dialog/re-evaluate-website-pages-progress-dialog.component';
import { ReEvaluateEntityWebsitesProgressDialogComponent } from '../re-evaluate-entity-websites-progress-dialog/re-evaluate-entity-websites-progress-dialog.component';
import { ReEvaluateTagWebsitesProgressDialogComponent } from '../re-evaluate-tag-websites-progress-dialog/re-evaluate-tag-websites-progress-dialog.component';

@Component({
  selector: 'app-choose-pages-to-re-evaluate-dialog',
  templateUrl: './choose-pages-to-re-evaluate-dialog.component.html',
  styleUrls: ['./choose-pages-to-re-evaluate-dialog.component.css']
})
export class ChoosePagesToReEvaluateDialogComponent implements OnInit {

  pages: FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ChoosePagesToReEvaluateDialogComponent>
  ) {
    this.pages = new FormControl('all', [Validators.required]);
  }

  ngOnInit(): void {
  }

  reEvaluatePages(e): void {
    e.preventDefault();

    const data = {
      width: '40vw',
      disableClose: true,
      data: {
        option: this.pages.value,
        info: this.data.info
      }
    };

    if (this.data.dialog === 'website') {
      this.dialog.open(ReEvaluateWebsitePagesProgressDialogComponent, data);
    } else if (this.data.dialog === 'tag') {
      this.dialog.open(ReEvaluateTagWebsitesProgressDialogComponent, data);
    } else if (this.data.dialog === 'entity') {
      this.dialog.open(ReEvaluateEntityWebsitesProgressDialogComponent, data);
    }
    this.dialogRef.close();
  }
}
