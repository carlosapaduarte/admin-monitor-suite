import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
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
  selector: 'app-edit-entity-dialog',
  templateUrl: './edit-entity-dialog.component.html',
  styleUrls: ['./edit-entity-dialog.component.css']
})
export class EditEntityDialogComponent implements OnInit {

  matcher: ErrorStateMatcher;

  loadingWebsites: boolean;
  loadingCreate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredWebsites: Observable<any[]>;

  websites: any;
  selectedWebsites: any;

  entityForm: FormGroup;

  @ViewChild('websiteInput') websiteInput: ElementRef;
  @ViewChild('tagInput') tagInput: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private create: CreateService,
    private get: GetService,
    private verify: VerifyService,
    private message: MessageService
  ) {

    this.matcher = new MyErrorStateMatcher();

    this.entityForm = new FormGroup({
      shortName: new FormControl('', [
        Validators.required
      ], this.shortNameValidator.bind(this)),
      longName: new FormControl('', [
        Validators.required
      ], this.longNameValidator.bind(this)),
      websites: new FormControl()
    });

    this.loadingWebsites = true;
    this.loadingCreate = false;

    this.selectedWebsites = [];
  }

  ngOnInit(): void {
    /*this.server.userPost('/entity/info/', { this.data.id })
      .subscribe(data => {

      }, error => {

      });

    this.server.userPost('/websites/withoutEntity', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.websites = data.result;
            this.filteredWebsites = this.entityForm.controls.websites.valueChanges.pipe(
              startWith(null),
              map((website: any | null) => website ? this.filterWebsite(website) : this.websites.slice()));
            break;
        }
      }, error => {
        this.message.show('MISC.messages.data_error');
        console.log(error);
      }, () => {
        this.loadingWebsites = false;
      });

    this.server.userPost('/tags/all', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.tags = data.result;
            this.filteredTags = this.entityForm.controls.tags.valueChanges.pipe(
              startWith(null),
              map((tag: any | null) => tag ? this.filterTags(tag) : this.tags.slice()));
            break;
        }
      }, error => {
        this.message.show('MISC.messages.data_error');
        console.log(error);
      }, () => {
        this.loadingTags = false;
      });*/
  }

  resetForm(): void {
    this.entityForm.reset();
    this.selectedWebsites = [];
  }

  createEntity(e): void {
    e.preventDefault();

    const shortName = this.entityForm.value.shortName;
    const longName = this.entityForm.value.longName;
    const websites = _.map(this.selectedWebsites, 'WebsiteId');

    const formData = {
      shortName,
      longName,
      websites
    };

    this.loadingCreate = true;

    /*this.server.userPost('/entities/create', formData)
      .subscribe(data => {
         switch (data.success) {
           case 1:
             this.entityForm.reset();
             this.selectedTags = [];
             this.selectedWebsites = [];
             this.message.show('MISC.success');
             break;

           default:
             this.message.show('MISC.unexpected_error');
             break;
         }
      }, error => {
        this.loadingCreate = false;
        this.message.show('MISC.unexpected_error');
        console.log(error);
      }, () => {
        this.loadingCreate = false;
      });*/
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
      this.entityForm.controls.websites.setValue(null);
    }
  }

  shortNameValidator(control: AbstractControl): Promise<any> {
    const name = control.value;

    if (name != '') {
      return new Promise<any>((resolve, reject) => {
        /*this.server.get('/entities/existsShortName/' + name)
          .subscribe(data => {
            switch (data.success) {
              case 1:
                resolve(data.result ? { 'notTakenName': true } : null);
                break;

              default:
                reject(null);
                break;
            }
          }, error => {
            console.log(error);
            reject(null);
          });*/
      });
    } else {
      return null;
    }
  }

  longNameValidator(control: AbstractControl): Promise<any> {
    const name = control.value;

    if (name != '') {
      return new Promise<any>((resolve, reject) => {
        /*this.server.get('/entities/existsLongName/' + name)
          .subscribe(data => {
            switch (data.success) {
              case 1:
                resolve(data.result ? { 'notTakenName': true } : null);
                break;

              default:
                reject(null);
                break;
            }
          }, error => {
            console.log(error);
            reject(null);
          });*/
      });
    } else {
      return null;
    }
  }
}
