import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as _ from 'lodash';

import { CreateService } from '../../services/create.service';
import { GetService } from '../../services/get.service';
import { VerifyService } from '../../services/verify.service';
import { MessageService } from '../../services/message.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-tag-dialog',
  templateUrl: './add-tag-dialog.component.html',
  styleUrls: ['./add-tag-dialog.component.css']
})
export class AddTagDialogComponent implements OnInit {

  matcher: ErrorStateMatcher;

  loadingWebsites: boolean;
  loadingCreate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredWebsites: Observable<any[]>;

  @ViewChild('websiteInput') websiteInput: ElementRef;

  tagForm: FormGroup;
  websites: any;
  selectedWebsites: any;

  constructor(
    private create: CreateService,
    private get: GetService,
    private verify: VerifyService,
    private message: MessageService,
    private router: Router,
    private location: Location,
    private dialogRef: MatDialogRef<AddTagDialogComponent>
  ) {
    this.matcher = new MyErrorStateMatcher();

    this.tagForm = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ], this.nameValidator.bind(this)),
      observatorio: new FormControl(),
      websites: new FormControl()
    });

    this.selectedWebsites = [];

    this.loadingWebsites = true;
    this.loadingCreate = false;
  }

  ngOnInit() {
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

  resetForm(): void {
    this.tagForm.reset();
    this.selectedWebsites = [];
  }

  createTag(e): void {
    e.preventDefault();

    const name = this.tagForm.value.name;
    const observatorio = this.tagForm.value.observatorio ? 1 : 0;
    const websites = JSON.stringify(_.map(this.selectedWebsites, 'WebsiteId'));

    const formData = {
      name,
      observatorio,
      websites
    };

    this.loadingCreate = true;

    this.create.newTag(formData)
      .subscribe(success => {
        if (success !== null) {
          if (success) {
            this.message.show('TAGS_PAGE.ADD.messages.success');

            if (this.location.path() !== '/console/tags') {
              this.router.navigateByUrl('/console/tags');
            } else {
              window.location.reload();
            }

            this.dialogRef.close();
          }
        }
        this.loadingCreate = false;
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
    if (!_.includes(this.selectedWebsites, this.websites[index])) {
      this.selectedWebsites.push(this.websites[index]);
      this.websiteInput.nativeElement.value = '';
      this.tagForm.controls.websites.setValue(null);
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
