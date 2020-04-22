import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {CrawlerService} from '../../services/crawler.service';
import {MessageService} from '../../services/message.service';
import {CreateService} from '../../services/create.service';
import {VerifyService} from '../../services/verify.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {GetService} from '../../services/get.service';
import {Observable} from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-crawler-dialog',
  templateUrl: './crawler-dialog.component.html',
  styleUrls: ['./crawler-dialog.component.css']
})
export class CrawlerDialogComponent implements OnInit {

  separatorKeysCodes = [ENTER, COMMA];
  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;
  error: boolean;
  crawlExecuting: boolean;
  pageForm: FormGroup;

  url: string;
  domainId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private create: CreateService,
    private get: GetService,
    private crawl: CrawlerService,
    private msg: MessageService,
    private verify: VerifyService,
    private dialog: MatDialog,
    private router: Router,
    private location: Location,
    private dialogRef: MatDialogRef<CrawlerDialogComponent>
  ) {
    this.url = data.url;
    this.domainId = data.domainId;
    this.pageForm = this.formBuilder.group({
      maxDepth: new FormControl('', [
        Validators.pattern('^[0-9]*[1-9][0-9]*$'),
        Validators.required
      ]),
      maxPages: new FormControl('', [
        Validators.pattern('^[0-9]*$'),
        Validators.required
      ]),
      subDomain: new FormControl('', null, this.subDomainValidator.bind(this))
    });
    this.error = false;
    this.crawlExecuting = false;
  }

  ngOnInit() {
    this.get.getCrawlerConfig()
      .subscribe(result => {
        if (result !== null) {
          this.pageForm.controls.maxDepth.setValue(result.maxDepth);
          this.pageForm.controls.maxPages.setValue(result.maxPages);
        }
      });
  }

  executeCrawler() {
    if (this.subDomainValidator(this.pageForm.controls.subDomain) !== null) {
      let v = _.trim(this.pageForm.value.subDomain);
      if (v[0] === '/') {
        v = v.substring(1, v.length);
      }
      if (v[v.length - 1] === '/') {
        v = v.substring(0, v.length - 1);
      }

      const subDomain = v === '' ? this.url : this.url + '/' + v ;
      this.crawl.callCrawler(this.url, this.domainId, (!this.pageForm.value.subDomain ? this.url : subDomain),
        this.pageForm.value.maxDepth, this.pageForm.value.maxPages)
        .subscribe(response => {
          this.crawlExecuting = response; //always true
        });
    }
  }

  resetForm() {
    //this.pageForm.controls.maxDepth.setValue('1');
    //this.pageForm.controls.maxPages.setValue('0');
    this.pageForm.reset();
    this.verify.crawlerSearchExists(this.pageForm.value.subDomain);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  goToCrawlerList() {
    this.closeDialog();
    this.router.navigateByUrl('/console/crawler');
  }

  subDomainValidator(control: AbstractControl): Observable<any> {
    let v = _.trim(control.value);
    if (v[0] === '/') {
      v = v.substring(1, v.length);
    }
    if (v[v.length - 1] === '/') {
      v = v.substring(0, v.length - 1);
    }

    const subDomain = v === '' ? this.url : this.url + '/' + v ;
    return this.verify.crawlerSearchExists(subDomain);
  }
}
