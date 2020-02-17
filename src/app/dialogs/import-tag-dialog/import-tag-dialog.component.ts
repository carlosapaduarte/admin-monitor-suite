import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {VerifyService} from '../../services/verify.service';
import {UpdateService} from '../../services/update.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-import-tag-dialog',
  templateUrl: './import-tag-dialog.component.html',
  styleUrls: ['./import-tag-dialog.component.css']
})
export class ImportTagDialogComponent implements OnInit {

  tag: string;
  tagId: string;

  tagNameExists: boolean;

  pageForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private update: UpdateService,
    private verify: VerifyService,
    private formBuilder: FormBuilder,
  ) {
    this.tag = this.data.tag;
    this.tagId = this.data.tagId;
    this.pageForm = this.formBuilder.group({
      newTagName: new FormControl('', [
        Validators.required], this.nameValidator.bind(this))
    });
  }

  ngOnInit() {
    this.verify.tagNameDialogExists(this.tag).subscribe(
      res => {
        this.tagNameExists = res;
      });
  }

  importTag(): void {
    if (this.tagNameExists) {
      this.update.importTag({tagId: this.tagId, tagName: this.pageForm.value.newTagName}).subscribe();
    } else {
      this.update.importTag({tagId: this.tagId, tagName: this.tag}).subscribe();
    }
  }

  nameValidator(control: AbstractControl): Observable<any> {
    const name = _.trim(control.value);

    if (name !== '') {
      return this.verify.tagNameExists(name);
    } else {
      return of(null);
    }
  }
}
