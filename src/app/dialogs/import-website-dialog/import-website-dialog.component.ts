import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {VerifyService} from '../../services/verify.service';
import {UpdateService} from '../../services/update.service';

@Component({
  selector: 'app-import-website-dialog',
  templateUrl: './import-website-dialog.component.html',
  styleUrls: ['./import-website-dialog.component.css']
})
export class ImportWebsiteDialogComponent implements OnInit {

  websiteId: string;
  website: string;

  hasDomain: boolean;
  webName: string;
  domain: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private verify: VerifyService,
    private update: UpdateService,
  ) {
    this.website = this.data.website;
    this.websiteId = this.data.websiteId;
    this.hasDomain = this.data.hasDomain;
    this.webName = this.data.webName;
    this.domain = this.data.url;
    console.log(this.domain);
  }

  ngOnInit() {
  }

  importWebsite(): void {
      this.update.importWebsite({ websiteId: this.websiteId}).subscribe();
  }
}
