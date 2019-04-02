import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatAutocompleteSelectedEvent } from '@angular/material';
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

import {
  ChooseObservatoryWebsitePagesDialogComponent
} from '../choose-observatory-website-pages-dialog/choose-observatory-website-pages-dialog.component';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-edit-website-dialog',
  templateUrl: './edit-website-dialog.component.html',
  styleUrls: ['./edit-website-dialog.component.css']
})
export class EditWebsiteDialogComponent implements OnInit {

  matcher: ErrorStateMatcher;

  loadingInfo: boolean;
  loadingEntities: boolean;
  loadingUsers: boolean;
  loadingTags: boolean;
  loadingUpdate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredEntities: Observable<string[]>;
  filteredUsers: Observable<string[]>;
  filteredTags: Observable<any[]>;

  entities: any;
  monitorUsers: any;
  tags: any;
  selectedTags: any;

  websiteForm: FormGroup;

  defaultWebsite: any;

  @ViewChild('tagInput') tagInput: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditWebsiteDialogComponent>,
    private dialog: MatDialog,
    private get: GetService,
    private update: UpdateService,
    private deleteService: DeleteService,
    private verify: VerifyService,
    private message: MessageService
  ) {
    this.matcher = new MyErrorStateMatcher();

    this.websiteForm = new FormGroup({
      name: new FormControl('', Validators.required),
      domain: new FormControl({value: '', disabled: true}),
      entity: new FormControl(),
      user: new FormControl(),
      tags: new FormControl()
    });

    this.loadingEntities = true;
    this.loadingUsers = true;
    this.loadingTags = true;
    this.loadingUpdate = false;

    this.selectedTags = [];
  }

  ngOnInit(): void {
    this.get.websiteInfo(this.data.id)
      .subscribe(website => {
        if (website !== null) {
          this.defaultWebsite = _.cloneDeep(website);

          this.websiteForm.controls.name.setValue(website.Name);
          this.websiteForm.controls.domain.setValue(website.Domain);
          this.websiteForm.controls.entity.setValue(website.Entity);
          this.websiteForm.controls.user.setValue(website.User);
          this.selectedTags = website.tags;

          this.websiteForm.controls.name.setAsyncValidators(this.nameValidator.bind(this));
          this.websiteForm.controls.entity.setValidators(this.entityValidator.bind(this));
          this.websiteForm.controls.user.setValidators(this.userValidator.bind(this));
        }
      });

    this.get.listOfMyMonitorUsers()
      .subscribe(users => {
        if (users !== null) {
          this.monitorUsers = users;
          this.filteredUsers = this.websiteForm.controls.user.valueChanges
            .pipe(
              startWith(null),
              map(val => this.filterUser(val))
            );
        }
        this.loadingUsers = false;
      });

    this.get.listOfEntities()
      .subscribe(entities => {
        if (entities !== null) {
          this.entities = entities;
          this.filteredEntities = this.websiteForm.controls.entity.valueChanges
            .pipe(
              startWith(null),
              map(val => this.filterEntity(val))
            );
        }

        this.loadingEntities = false;
      });

    this.get.listOfOfficialTags()
      .subscribe(tags => {
        if (tags !== null) {
          this.tags = tags;
          this.filteredTags = this.websiteForm.controls.tags.valueChanges.pipe(
            startWith(null),
            map((tag: any | null) => tag ? this.filterTags(tag) : this.tags.slice()));
        }

        this.loadingTags = false;
      });
  }

  setDefault(): void {
    this.websiteForm.controls.name.setValue(this.defaultWebsite.Name);
    this.websiteForm.controls.domain.setValue(this.defaultWebsite.Domain);
    this.websiteForm.controls.entity.setValue(this.defaultWebsite.Entity);
    this.websiteForm.controls.user.setValue(this.defaultWebsite.User);
    this.selectedTags = _.clone(this.defaultWebsite.tags);
  }

  deleteWebsite(): void {
    this.deleteService.website({websiteId: this.data.id})
      .subscribe(success => {
        if (success !== null) {
          this.message.show('WEBSITES_PAGE.DELETE.messages.success');
          this.dialogRef.close(true);
        }
      });
  }

  updateWebsite(e): void {
    e.preventDefault();

    const name = _.trim(this.websiteForm.value.name);
    const domain = encodeURIComponent(_.trim(this.websiteForm.value.domain));
    const entityId = this.websiteForm.value.entity ?
      _.find(this.entities, ['Long_Name', this.websiteForm.value.entity]).EntityId : null;
    const userId = this.websiteForm.value.user ?
      _.find(this.monitorUsers, ['Username', this.websiteForm.value.user]).UserId : null;

    const defaultTags = JSON.stringify(_.map(this.defaultWebsite.tags, 'TagId'));
    const tags = JSON.stringify(_.map(this.selectedTags, 'TagId'));

    const formData = {
      websiteId: this.data.id,
      name,
      domain,
      entityId,
      userId,
      defaultTags,
      tags
    };

    this.loadingUpdate = true;

    this.update.website(formData)
      .subscribe(success => {
        if (success !== null) {
          this.message.show('WEBSITES_PAGE.UPDATE.messages.success');
          this.dialogRef.close(true);
        }

        this.loadingUpdate = false;
      });
  }

  removeTag(tag: any): void {
    const index = _.findIndex(this.selectedTags, tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  chooseObservatorioPages(): void {
    this.dialog.open(ChooseObservatoryWebsitePagesDialogComponent, {
      width: '60vw',
      data: this.data
    });
  }

  filterTags(name: string) {
    return this.tags.filter(tag => _.includes(_.toLower(tag.Name), _.toLower(name)));
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    const index = _.findIndex(this.tags, t => t['Name'] === event.option.viewValue);
    const index2 = _.findIndex(this.selectedTags, t => t['Name'] === event.option.viewValue);
    if (index2 === -1) {
      this.selectedTags.push(this.tags[index]);
      this.tagInput.nativeElement.value = '';
      this.websiteForm.controls.tags.setValue(null);
    }
  }

  filterEntity(val: any): string[] {
    return this.entities.filter(entity =>
      _.includes(_.toLower(entity.Long_Name), _.toLower(val)));
  }

  filterUser(val: any): string[] {
    return this.monitorUsers.filter(user =>
      _.includes(_.toLower(user.Username), _.toLower(val)));
  }

  nameValidator(control: AbstractControl): Observable<any> {
    const name = _.trim(control.value);

    if (name !== '' && name !== this.defaultWebsite.Name) {
      return this.verify.websiteNameExists(name);
    } else {
      return of(null);
    }
  }

  entityValidator(control: AbstractControl): any {
    const val = _.trim(control.value);

    if (val) {
      return _.includes(_.map(this.entities, 'Long_Name'), val) ? null : { 'validEntity': true };
    } else {
      return null;
    }
  }

  userValidator(control: AbstractControl): any {
    const val = _.trim(control.value);
    if (val) {
      return _.includes(_.map(this.monitorUsers, 'Username'), val) ? null : { 'validUser': true };
    } else {
      return null;
    }
  }
}
