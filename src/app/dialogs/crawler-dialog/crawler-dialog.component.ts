import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {CrawlerService} from '../../services/crawler.service';
import {MessageService} from '../../services/message.service';
import {CreateService} from '../../services/create.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {AddCrawlerPagesDialogComponent} from '../add-crawler-pages-dialog/add-crawler-pages-dialog.component';

@Component({
  selector: 'app-crawler-dialog',
  templateUrl: './crawler-dialog.component.html',
  styleUrls: ['./crawler-dialog.component.css']
})
export class CrawlerDialogComponent implements OnInit {

  error: boolean;
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
    this.error = false;
  }

  ngOnInit() {
  }

  log(e) {
    console.log(e);
  }

  executeCrawler() {
    this.error = false;
    this.loadingResponse = true;
    this.dialogRef.disableClose = true;
    this.crawl.callCrawler(this.url, this.domainId, this.pageForm.value.maxDepth, this.pageForm.value.maxPages)
      .subscribe(response => {
        if (response > 0) {
          const chooseDialog = this.dialog.open(AddCrawlerPagesDialogComponent, {
            width: '40vw',
            data: {
              // TODO fix this
              uris: JSON.parse(response.toLocaleString())
            }
          });
          chooseDialog.afterClosed().subscribe(result => {
            if (!result.cancel) {
              this.addPages(this.domainId, result.uris);
              // TODO verificar se estah bem
              this.msg.show('CRAWLER.MESSAGE.success', 3000, null, {value: response});
            }
          });
        } else {
          this.error = true;
        }
        this.dialogRef.disableClose = false;
        this.loadingResponse = false;
      });
  }

  resetForm() {
    this.error = false;
    this.pageForm.controls.maxDepth.setValue('1');
    this.pageForm.controls.maxPages.setValue('0');
  }

  private addPages(domainId: number, uris: any): void {
    const formData = {
      domainId,
      uris
    };

    this.create.newPages(formData)
      .subscribe(success => {
        if (success !== null) {
          if (success) {
            this.msg.show('PAGES_PAGE.ADD.messages.success');
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
