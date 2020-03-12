  import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

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

  websiteNameExists: boolean;
  pageForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private verify: VerifyService,
    private update: UpdateService,
    private formBuilder: FormBuilder,
  ) {
    this.website = this.data.website;
    this.websiteId = this.data.websiteId;
    this.hasDomain = this.data.hasDomain;
    this.webName = this.data.webName;
    this.domain = this.data.url;
    this.pageForm = this.formBuilder.group({
      newWebsiteName: new FormControl('',
      [Validators.required], this.nameValidator.bind(this))
    });
  }

  ngOnInit() {
    this.verify.websiteNameExists(this.website).subscribe(
      res => {
        this.websiteNameExists = res;
      });
  }

  importWebsite(): void {
    if (!this.hasDomain) {
      this.update.importWebsite({websiteId: this.websiteId, websiteName: this.pageForm.value.newWebsiteName}).subscribe();
    } else {
      this.update.importWebsite({websiteId: this.websiteId, websiteName: this.website}).subscribe();
    }
  }

  nameValidator(control: AbstractControl): Observable<any> {
    const name = _.trim(control.value);

    if (name !== '') {
      return this.verify.websiteNameExists(name);
    } else {
      return null;
    }
  }
}
