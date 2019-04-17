import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {CrawlerService} from '../../services/crawler.service';
import {MessageService} from '../../services/message.service';
import {CreateService} from '../../services/create.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {AddCrawlerPagesDialogComponent} from '../add-crawler-pages-dialog/add-crawler-pages-dialog.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-crawler-dialog',
  templateUrl: './crawler-dialog.component.html',
  styleUrls: ['./crawler-dialog.component.css']
})
export class CrawlerDialogComponent implements OnInit {

  loadingResponse: boolean;
  separatorKeysCodes = [ENTER, COMMA];
  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  pageForm: FormGroup;

  url: string;
  domainId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private create: CreateService,
    private crawl: CrawlerService,
    private msg: MessageService,
    private dialog: MatDialog,
    private router: Router,
    private location: Location,
    private dialogRef: MatDialogRef<CrawlerDialogComponent>
  ) {
    this.url = data.url;
    this.domainId = data.domainId;
    this.pageForm = this.formBuilder.group({
      maxDepth: new FormControl('1', [
        Validators.pattern('^[0-9]*[1-9][0-9]*$'),
        Validators.required
      ]),
      maxPages: new FormControl('0', [
        Validators.pattern('^[0-9]*$'),
        Validators.required
      ]),
    });
    this.loadingResponse = false;
  }

  ngOnInit() {
  }

  log(e) {
    console.log(e);
  }

  executeCrawler() {
    this.loadingResponse = true;
    this.dialogRef.disableClose = true;
    this.crawl.callCrawler(this.url, this.pageForm.value.maxDepth, this.pageForm.value.maxPages)
      .subscribe(response => {
        if (response.length > 0) {

          // JSON stringify of result array to string
          const uris = JSON.stringify(_.without(_.uniq(_.map(response, p => {
            p = _.replace(p, 'http://', '');
            p = _.replace(p, 'https://', '');
            p = _.replace(p, 'www.', '');

            if (p[_.size(p) - 1] === '/') {
              p = p.substring(0, _.size(p) - 1);
            }

            return _.trim(p);
          })), ''));

          const chooseDialog = this.dialog.open(AddCrawlerPagesDialogComponent, {
            width: '40vw',
            data: {
              uris: JSON.parse(uris),
              domain: this.url,
              domainId: this.domainId
            }
          });
          chooseDialog.afterClosed().subscribe(result => {
            if (!result.cancel) {
              this.addPages(this.domainId, result.uris, JSON.stringify([]));
            }
          });
          this.dialogRef.close();
        } else if (response.length === 0) {
          this.msg.show('CRAWLER.MESSAGE.no_pages');
        } else {
          this.msg.show('CRAWLER.MESSAGE.failed', 7000);
        }
        this.dialogRef.disableClose = false;
        this.loadingResponse = false;
      });
  }

  resetForm() {
    this.pageForm.controls.maxDepth.setValue('1');
    this.pageForm.controls.maxPages.setValue('0');
  }

  private addPages(domainId: number, uris: any, observatorio: any): void {
    const formData = {
      domainId,
      uris,
      observatorio
    };

    this.create.newPages(formData)
      .subscribe(success => {
        if (success !== null) {
          if (success) {
            this.msg.show('CRAWLER.MESSAGE.success');
            if (this.location.path() !== '/console/pages') {
              this.router.navigateByUrl('/console/pages');
            } else {
              window.location.reload();
            }
            this.dialogRef.close();
          }
        }
      });
  }
}
