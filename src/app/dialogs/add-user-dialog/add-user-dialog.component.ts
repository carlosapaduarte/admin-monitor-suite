import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators, FormGroupDirective, NgForm, ValidationErrors } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, of } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipList } from '@angular/material/chips';
import * as _ from 'lodash';

import { GetService } from '../../services/get.service';
import { CreateService } from '../../services/create.service';
import { VerifyService } from '../../services/verify.service';
import { MessageService } from '../../services/message.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export class PasswordValidation {

  static MatchPassword(AC: AbstractControl) {
    const password = AC.get('password').value;
    const confirmPassword = AC.get('confirmPassword').value;

    if (!_.isEqual(password, confirmPassword)) {
      AC.get('confirmPassword').setErrors({ MatchPassword: true });
    } else {
      return null;
    }
  }
}

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {

  @ViewChild('emailsChipList', { static: true }) emailsChipList: MatChipList;

  loadingCreate: boolean;
  loadingTags: boolean;
  loadingWebsites: boolean;

  matcher: ErrorStateMatcher;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;
  removeList = false;

  separatorKeysCodes = [ENTER, COMMA];

  names: Array<string>;
  emails: Array<string>;
  siteTransferList: Array<String>;

  filteredTags: Observable<any[]>;
  filteredWebsites: Observable<any[]>;

  tags: any;
  selectedTags: any;

  websites: any;
  selectedWebsites: any;

  hide: boolean;
  hide2: boolean;
  userForm: FormGroup;

  @ViewChild('websiteInput') websiteInput: ElementRef;
  @ViewChild('tagInput') tagInput: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private get: GetService,
    private create: CreateService,
    private verify: VerifyService,
    private message: MessageService,
    private router: Router,
    private location: Location,
    private dialogRef: MatDialogRef<AddUserDialogComponent>
  ) {
    this.loadingCreate = false;
    this.hide = true;
    this.hide2 = true;

    this.matcher = new MyErrorStateMatcher();

    this.userForm = this.formBuilder.group({
      username: new FormControl('', [
        Validators.required
      ], this.usernameValidator.bind(this)),
      names: new FormControl(),
      emails: new FormControl(),
      password: new FormControl('', [
        Validators.required,
        passwordValidator
      ]),
      confirmPassword: new FormControl('', [
        Validators.required
      ]),
      app: new FormControl('', [
        Validators.required
      ]),
      tags: new FormControl({value: '', disabled: true}),
      transfer: new FormControl({value: '', disabled: true}),
      websites: new FormControl({value: '', disabled: true})
    },
    {
      validator: PasswordValidation.MatchPassword
    });

    this.names = [];
    this.emails = [];
    this.selectedTags = [];
    this.selectedWebsites = [];
    this.loadingWebsites = true;
    this.loadingTags = true;
  }

  ngOnInit(): void {
    this.get.websitesWithoutUser()
      .subscribe(websites => {
        if (websites !== null) {
          this.websites = websites;
          this.filteredWebsites = this.userForm.controls.websites.valueChanges.pipe(
            startWith(null),
            map((website: any | null) => website ? this.filterWebsite(website) : this.websites.slice()));
        }

        this.loadingWebsites = false;
      });

    this.get.listOfOfficialTags()
      .subscribe(tags => {
        if (tags !== null) {
          this.tags = tags;
          this.filteredTags = this.userForm.controls.tags.valueChanges.pipe(
            startWith(null),
            map((tag: any | null) => tag ? this.filterTag(tag) : this.tags.slice()));
        }

        this.loadingTags = false;
      });

    this.userForm.get('emails').statusChanges.subscribe(status =>
     this.emailsChipList.errorState = status === 'INVALID' ? true : false);
  }

  changeApp(): void {
    if (_.isEqual(this.userForm.value.app, 'monitor')) {
      this.userForm.controls.websites.enable();
      this.userForm.controls.tags.reset();
      this.userForm.controls.tags.disable();
      this.selectedTags = [];
    } if (_.isEqual(this.userForm.value.app, 'studies')) {
      this.userForm.controls.tags.enable();
      this.userForm.controls.websites.reset();
      this.userForm.controls.websites.disable();
      this.userForm.controls.transfer.disable();
      this.selectedWebsites = [];
      this.userForm.controls.transfer.setValue(false);
    } else {
      this.userForm.controls.websites.reset();
      this.userForm.controls.websites.disable();
      this.userForm.controls.transfer.disable();
      this.selectedWebsites = [];
      this.userForm.controls.transfer.setValue(false);
      this.userForm.controls.tags.reset();
      this.userForm.controls.tags.disable();
      this.selectedTags = [];
    }
  }

  resetForm(): void {
    this.userForm.reset();
    this.selectedWebsites = [];
    this.selectedTags = [];
    this.emails = [];
    this.names = [];
  }

  createUser(e): void {
    e.preventDefault();

    const username = this.userForm.value.username;
    const password = this.userForm.value.password;
    const confirmPassword = this.userForm.value.confirmPassword;
    const names = _.join(this.names, ';');
    const emails = _.join(this.emails, ';');
    const type = this.userForm.value.app;
    const tags = _.map(this.selectedTags, 'TagId');
    const websites = _.map(this.selectedWebsites, 'WebsiteId');
    const transfer = this.userForm.value.transfer;
    const formData = {
      username,
      password,
      confirmPassword,
      names,
      emails,
      type,
      tags: JSON.stringify(tags),
      websites: JSON.stringify(websites),
      transfer
    };

    this.loadingCreate = true;

    this.create.newUser(formData)
      .subscribe(success => {
        if (success !== null) {
          if (success) {
            this.message.show('USERS_PAGE.ADD.messages.success');

            if (this.location.path() !== '/console/users') {
              this.router.navigateByUrl('/console/users');
            } else {
              window.location.reload();
            }

            this.dialogRef.close();
          }
        }

        this.loadingCreate = false;
      });
  }

  addName(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.names.push(_.trim(value));
    }

    if (input) {
      input.value = '';
    }
  }

  removeName(name: string): void {
    const index = this.names.indexOf(name);

    if (index >= 0) {
      this.names.splice(index, 1);
    }
  }

  addEmail(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      if (!this.isEmailInvalid(value)) {
        this.emails.push(_.trim(value));

        if (input) {
          input.value = '';
        }
        this.userForm.controls.emails.setErrors(null);
      } else {
        this.userForm.controls.emails.setErrors({'emailError': value});
      }
    }
  }

  removeEmail(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  removeWebsite(website: any): void {
    const index = _.findIndex(this.selectedWebsites, website);

    if (index >= 0) {
      this.selectedWebsites.splice(index, 1);
    }
    if (this.selectedWebsites.length === 0) {
      this.userForm.controls.transfer.disable();
      this.userForm.controls.transfer.setValue(false);
    }
  }

  removeTag(tag: any): void {
    const index = _.findIndex(this.selectedTags, tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  removeWebsites(): void {
    this.selectedWebsites = [];
    this.userForm.controls.transfer.disable();
    this.userForm.controls.transfer.setValue(false);
  }

  removeTags(): void {
    this.selectedTags = [];
  }

  removeTransferList(website: any): void {
    this.siteTransferList = null;
  }

  filterTag(name: string) {
    return this.tags.filter(tag =>
        _.includes(tag.Name.toLowerCase(), name.toLowerCase()));
  }

  filterWebsite(name: string) {
    return this.websites.filter(website =>
        _.includes(website.Name.toLowerCase(), name.toLowerCase()));
  }

  selectedWebsite(event: MatAutocompleteSelectedEvent): void {
    const index = _.findIndex(this.websites, w => w['Name'] === event.option.viewValue);
    if (!_.includes(this.selectedWebsites, this.websites[index])) {
      this.selectedWebsites.push(this.websites[index]);
      this.websiteInput.nativeElement.value = '';
      this.userForm.controls.websites.setValue(null);
    }
    if (this.selectedWebsites.length > 0) {
      this.userForm.controls.transfer.enable();
    }
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    const index = _.findIndex(this.tags, t => t['Name'] === event.option.viewValue);
    if (!_.includes(this.selectedTags, this.tags[index])) {
      this.selectedTags.push(this.tags[index]);
      this.tagInput.nativeElement.value = '';
      this.userForm.controls.tags.setValue(null);
    }
  }

  usernameValidator(control: AbstractControl): Observable<any> {
    const username = _.trim(control.value);

    if (username !== '') {
      return this.verify.userExists(username);
    } else {
      return null;
    }
  }

  isEmailInvalid(email: string): boolean {
    let error = false;

    if (email !== '') {
      if (_.includes(email, '@')) {
        let split = _.split(email, '@');
        if (split[0] !== '' && split[1] !== '' && _.size(split) === 2) {
          if (_.includes(split[1], '.')) {
            split = _.split(split[1], '.');

            if (split[0] === '' || split[1] === '' || _.size(split) !== 2) {
              error = true;
            }
          } else {
            error = true;
          }
        } else {
          error = true;
        }
      } else {
        error = true;
      }
    }

    return error;
  }
}


function passwordValidator(control: FormControl): ValidationErrors | null {
  try {
    const password = control.value;

    if (password.length > 0) {
      const errors = {};
      const isShort = password.length < 8;

      if (isShort) {
        errors['isShort'] = true;
      }

      const hasUpperCase = password.toLowerCase() !== password;

      if (!hasUpperCase) {
        errors['doesNotHaveUpperCase'] = true;
      }

      const hasLowerCase = password.toUpperCase() !== password;

      if (!hasLowerCase) {
        errors['doesNotHaveLowerCase'] = true;
      }

      const specialFormat = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      const hasSpecial = specialFormat.test(password);

      if (!hasSpecial) {
        errors['doesNotHaveSpecial'] = true;
      }

      const numberFormat = /\d/g;
      const hasNumber = numberFormat.test(password);

      if (!hasNumber) {
        errors['doesNotHaveNumber'] = true;
      }

      if (Object.keys(errors).length > 0) {
        return errors;
      }
    }
  } catch(err) {
    console.log(err);
  }

  return null;
}