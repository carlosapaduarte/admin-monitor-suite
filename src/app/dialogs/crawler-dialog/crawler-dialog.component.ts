import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
  ) {
    this.url = data.url;
    this.pageForm = this.formBuilder.group({
        maxDepth: new FormControl(),
        maxPages: new FormControl(),
        isMinDepth: new FormControl()
      });
  }

  ngOnInit() {
  }

  executeCrawler(e: Event) {
  }
}
