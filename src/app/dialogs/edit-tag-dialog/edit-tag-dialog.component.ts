import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as _ from 'lodash';

import { CreateService } from '../../services/create.service';
import { GetService } from '../../services/get.service';
import { VerifyService } from '../../services/verify.service';
import { UpdateService } from '../../services/update.service';
import { DeleteService } from '../../services/delete.service';
import { MessageService } from '../../services/message.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-edit-tag-dialog',
  templateUrl: './edit-tag-dialog.component.html',
  styleUrls: ['./edit-tag-dialog.component.css']
})
export class EditTagDialogComponent implements OnInit {

  matcher: ErrorStateMatcher;

  loadingInfo: boolean;
  loadingWebsites: boolean;
  loadingUpdate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredWebsites: Observable<any[]>;

  websites: any;
  selectedWebsites: any;

  tagForm: FormGroup;

  copyTagForm: FormGroup;

  defaultTag: any;

  @ViewChild('websiteInput') websiteInput: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditTagDialogComponent>,
    private get: GetService,
    private update: UpdateService,
    private deleteService: DeleteService,
    private verify: VerifyService,
    private message: MessageService
  ) {
    this.defaultTag = {};
    this.websites = [];

    this.matcher = new MyErrorStateMatcher();

    this.tagForm = new FormGroup({
      name: new FormControl('', Validators.required),
      observatorio: new FormControl(),
      websites: new FormControl()
    });

    this.copyTagForm = new FormGroup({
      name: new FormControl('', Validators.required)
    });

    this.loadingInfo = true;
    this.loadingWebsites = true;
    this.loadingUpdate = false;

    this.selectedWebsites = [];
  }

  ngOnInit(): void {
    this.get.tagInfo(this.data.id)
      .subscribe(tag => {
        if (tag !== null) {
          this.defaultTag = _.cloneDeep(tag);

          this.tagForm.controls.name.setValue(tag.Name);
          this.tagForm.controls.observatorio.setValue(tag.Show_in_Observatorio);
          this.selectedWebsites = tag.websites;

          this.copyTagForm.controls.name.setValue(tag.Name);

          //this.websites = this.websites.concat(tag.websites);

          this.tagForm.controls.name.setAsyncValidators(this.nameValidator.bind(this));
          this.copyTagForm.controls.name.setAsyncValidators(this.nameValidator.bind(this));
        }

        this.loadingUpdate = false;
      });

    this.get.listOfOfficialWebsites()
      .subscribe(websites => {
        if (websites !== null) {
          this.websites = websites;
          this.filteredWebsites = this.tagForm.controls.websites.valueChanges.pipe(
            startWith(null),
            map((website: any | null) => website ? this.filterWebsite(website) : this.websites.slice()));
        }
        this.loadingWebsites = false;
      });
  }

  setDefault(): void {
    this.tagForm.controls.name.setValue(this.defaultTag.Name);
    this.tagForm.controls.observatorio.setValue(this.defaultTag.Show_in_Observatorio);
    this.selectedWebsites = _.clone(this.defaultTag.websites);
  }

  deleteTag(): void {
    this.deleteService.tag({tagId: this.data.id})
      .subscribe(success => {
        if (success !== null) {
          this.message.show('TAGS_PAGE.DELETE.messages.success');
          this.dialogRef.close(true);
        }
      });
  }

  updateTag(e): void {
    e.preventDefault();

    const name = this.tagForm.value.name;
    const observatorio = this.tagForm.value.observatorio ? 1 : 0;

    const defaultWebsites = JSON.stringify(_.map(this.defaultTag.websites, 'WebsiteId'));
    const websites = JSON.stringify(_.map(this.selectedWebsites, 'WebsiteId'));

    const formData = {
      tagId: this.data.id,
      name,
      observatorio,
      defaultWebsites,
      websites
    };

    this.loadingUpdate = true;

    this.update.tag(formData)
      .subscribe(success => {
        if (success !== null) {
          this.message.show('TAGS_PAGE.UPDATE.messages.success');
          this.dialogRef.close(true);
        }
        this.loadingUpdate = false;
      });
  }

  transformOfficial(e): void {
    e.preventDefault();

    const name = this.copyTagForm.value.name;

    const formData = {
      tagId: this.data.id,
      name
    };

    this.loadingUpdate = true;

    this.update.copyTag(formData)
      .subscribe(success => {
        if (success !== null) {
          this.message.show('TAGS_PAGE.UPDATE.user_tag.messages.success');
          this.dialogRef.close(true);
        }
        this.loadingUpdate = false;
      });
  }

  removeWebsite(website: any): void {
    const index = _.findIndex(this.selectedWebsites, website);

    if (index >= 0) {
      this.selectedWebsites.splice(index, 1);
    }
  }

  filterWebsite(name: string) {
    return this.websites.filter(website =>
        _.includes(website.Name.toLowerCase(), name.toLowerCase()));
  }

  selectedWebsite(event: MatAutocompleteSelectedEvent): void {
    const index = _.findIndex(this.websites, w => w.Name === event.option.viewValue);
    const index2 = _.findIndex(this.selectedWebsites, w => w.Name === event.option.viewValue);
    if (index2 < 0) {
      this.selectedWebsites.push(this.websites[index]);
      this.websiteInput.nativeElement.value = '';
      this.tagForm.controls.websites.setValue(null);
    }
  }

  nameValidator(control: AbstractControl): Observable<any> {
    const name = _.trim(control.value);

    if (name !== '' && name !== this.defaultTag.Name) {
      return this.verify.tagNameExists(name);
    } else {
      return of(null);
    }
  }
}
