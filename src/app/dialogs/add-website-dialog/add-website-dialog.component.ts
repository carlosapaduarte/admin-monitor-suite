import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
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
  selector: 'app-add-website-dialog',
  templateUrl: './add-website-dialog.component.html',
  styleUrls: ['./add-website-dialog.component.css']
})
export class AddWebsiteDialogComponent implements OnInit {

  matcher: ErrorStateMatcher;

  loadingEntities: boolean;
  loadingUsers: boolean;
  loadingTags: boolean;
  loadingCreate: boolean;

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

  @ViewChild('tagInput') tagInput: ElementRef;

  constructor(
    private create: CreateService,
    private get: GetService,
    private verify: VerifyService,
    private message: MessageService,
    private router: Router,
    private location: Location,
    private dialogRef: MatDialogRef<AddWebsiteDialogComponent>
  ) {
    this.matcher = new MyErrorStateMatcher();

    this.websiteForm = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ], this.nameValidator.bind(this)),
      domain: new FormControl('', [
        Validators.required
      ], this.domainValidator.bind(this)),
      entity: new FormControl('', [
        this.entityValidator.bind(this)
      ]),
      user: new FormControl('', [
        this.userValidator.bind(this)
      ]),
      tags: new FormControl()
    });

    this.loadingEntities = true;
    this.loadingUsers = true;
    this.loadingTags = true;
    this.loadingCreate = false;

    this.selectedTags = [];
  }

  ngOnInit(): void {
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

  resetForm(): void {
    this.websiteForm.reset();
    this.selectedTags = [];
  }

  createWebsite(e): void {
    e.preventDefault();

    const name = _.trim(this.websiteForm.value.name);
    const domain = encodeURIComponent(_.trim(this.websiteForm.value.domain));
    const entityId = this.websiteForm.value.entity ?
      _.find(this.entities, ['Long_Name', this.websiteForm.value.entity]).EntityId : null;
    const userId = this.websiteForm.value.user ?
      _.find(this.monitorUsers, ['Email', this.websiteForm.value.user]).UserId : null;
    const tags = JSON.stringify(_.map(this.selectedTags, 'TagId'));

    const formData = {
      name,
      domain,
      entityId,
      userId,
      tags
    };

    this.loadingCreate = true;

    this.create.newWebsite(formData)
      .subscribe(success => {
        if (success !== null) {
          if (success) {
            this.message.show('WEBSITES_PAGE.ADD.messages.success');

            if (this.location.path() !== '/console/websites') {
              this.router.navigateByUrl('/console/websites');
            } else {
              window.location.reload();
            }

            this.dialogRef.close();
          }
        }

        this.loadingCreate = false;
      });
  }

  removeTag(tag: any): void {
    const index = _.findIndex(this.selectedTags, tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  filterTags(name: string) {
    return this.tags.filter(tag => _.includes(_.toLower(tag.Name), _.toLower(name)));
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    const index = _.findIndex(this.tags, t => t.Name === event.option.viewValue);
    if (!_.includes(this.selectedTags, this.tags[index])) {
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
      _.includes(_.toLower(user.Email), _.toLower(val)));
  }

  nameValidator(control: AbstractControl): Observable<any> {
    const name = _.trim(control.value);

    if (name !== '') {
      return this.verify.websiteNameExists(name);
    } else {
      return null;
    }
  }

  domainValidator(control: AbstractControl): Observable<any> {
    const domain = _.trim(control.value);

    if (domain !== '') {
      return this.verify.domainExists(domain);
    } else {
      return null;
    }
  }

  entityValidator(control: AbstractControl): any {
    const val = _.trim(control.value);
    if (val !== '' && val !== null) {
      return _.includes(_.map(this.entities, 'Long_Name'), val) ? null : { 'validEntity': true };
    } else {
      return null;
    }
  }

  userValidator(control: AbstractControl): any {
    const val = _.trim(control.value);
    if (val !== '' && val !== null) {
      return _.includes(_.map(this.monitorUsers, 'Email'), val) ? null : { 'validUser': true };
    } else {
      return null;
    }
  }
}
