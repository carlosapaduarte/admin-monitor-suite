import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-crawler-dialog',
  templateUrl: './crawler-dialog.component.html',
  styleUrls: ['./crawler-dialog.component.css']
})
export class CrawlerDialogComponent implements OnInit {

  loadingCreate: boolean;
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
  ) {
    this.url = data.url;
    this.domainId = data.domainId;
    this.pageForm = this.formBuilder.group({
        maxDepth: new FormControl(),
        maxPages: new FormControl(),
        isMinDepth: new FormControl()
      });
    this.loadingCreate = false;
  }

  ngOnInit() {
  }
/*
  executeCrawler(e: Event) {
    const crawler = Crawler(this.url)
      .on("fetchcomplete", function(queueItem, responseBuffer, response){
        console.log("queueItem - " + queueItem + "\nrespondeBuffer - " + responseBuffer + "\nresponse - " + response);
      });
    crawler.maxDepth = 2;
    crawler.maxLinkNumber = x;
    crawler.start();
    /*crawler.queue.countItems({ fetched: true }, function(error, count) {
    console.log("The number of completed items is %d", count);
    this.loadingCreate = true;
});

  } */
}
