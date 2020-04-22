import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {CrawlerService} from '../../services/crawler.service';
import {MessageService} from '../../services/message.service';
import {CreateService} from '../../services/create.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {GetService} from '../../services/get.service';
import {UpdateService} from '../../services/update.service';

@Component({
  selector: 'app-crawler-config-dialog',
  templateUrl: './crawler-config-dialog.component.html',
  styleUrls: ['./crawler-config-dialog.component.css']
})
export class CrawlerConfigDialogComponent implements OnInit {

  error: boolean;
  pageForm: FormGroup;

  url: string;
  domainId: number;

  getConfig: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private create: CreateService,
    private crawl: CrawlerService,
    private get: GetService,
    private update: UpdateService,
    private dialog: MatDialog,
    private router: Router,
    private location: Location,
    private dialogRef: MatDialogRef<CrawlerConfigDialogComponent>
  ) {
    this.pageForm = this.formBuilder.group({
      maxDepth: new FormControl('', [
        Validators.pattern('^[0-9]*[1-9][0-9]*$')
      ]),
      maxPages: new FormControl('', [
        Validators.pattern('^[0-9]*$')
      ]),
    });
    this.error = false;
  }

  ngOnInit() {
    this.get.getCrawlerConfig()
      .subscribe(result => {
        if (result !== null) {
          this.getConfig = result;
          this.pageForm.controls.maxDepth.setValue(result.maxDepth);
          this.pageForm.controls.maxPages.setValue(result.maxPages);
        }
      });
  }

  updateConfig() {
    const maxDepth = this.pageForm.value.maxDepth === '' ? this.getConfig.maxDepth : this.pageForm.value.maxDepth;
    const maxPages = this.pageForm.value.maxPages === '' ? this.getConfig.maxPages : this.pageForm.value.maxPages;
    this.update.crawlerConfig({maxDepth, maxPages}).subscribe();
    this.closeDialog();
  }

  resetForm() {
    this.pageForm.controls.maxDepth.setValue('');
    this.pageForm.controls.maxPages.setValue('');
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
