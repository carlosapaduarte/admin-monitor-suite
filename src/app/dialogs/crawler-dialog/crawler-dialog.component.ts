import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatTableDataSource} from '@angular/material';

import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {CrawlerService} from '../../services/crawler.service';
import {MessageService} from '../../services/message.service';

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
    private crawl: CrawlerService,
    private msg: MessageService
  ) {
    this.url = data.url;
    this.domainId = data.domainId;
    this.pageForm = this.formBuilder.group({
        maxDepth: new FormControl('1', [
          Validators.pattern('^[0-9]*[1-9][0-9]*$')
        ]),
        maxPages: new FormControl('0', [
          Validators.pattern('^[0-9]*$')
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
    this.loadingResponse = true;
    this.crawl.callCrawler(this.url, this.pageForm.value.maxDepth, this.pageForm.value.maxPages)
      .subscribe(response => {
        if (response > 0) {
          // TODO verificar se estah bem
          this.msg.show( 'CRAWLER.MESSAGE.success', 5000, null, { value: response });
        } else {
          this.error = true;
        }
        this.loadingResponse = false;
      });
  }

  resetForm() {
    this.error = false;
    this.pageForm.reset();
  }
}
