import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipList } from '@angular/material';
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
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css']
})
export class EditUserDialogComponent implements OnInit {

  @ViewChild('emailsChipList') emailsChipList: MatChipList;

  matcher: ErrorStateMatcher;

  loadingInfo: boolean;
  loadingWebsites: boolean;
  loadingUpdate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  names: Array<string>;
  emails: Array<string>;

  filteredWebsites: Observable<any[]>;

  websites: any;
  selectedWebsites: any;

  hide: boolean;
  hide2: boolean;
  userForm: FormGroup;

  defaultUser: any;

  @ViewChild('websiteInput') websiteInput: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    private formBuilder: FormBuilder,
    private get: GetService,
    private update: UpdateService,
    private deleteService: DeleteService,
    private message: MessageService
  ) {
    this.hide = true;
    this.hide2 = true;

    this.defaultUser = {};
    this.websites = [];

    this.matcher = new MyErrorStateMatcher();

    this.userForm = this.formBuilder.group({
      username: new FormControl({value: '', disabled: true}),
      password: new FormControl(),
      confirmPassword: new FormControl(),
      names: new FormControl(),
      emails: new FormControl(),
      app: new FormControl({value: '', disabled: true}),
      websites: new FormControl()
    },
    {
      validator: PasswordValidation.MatchPassword
    });

    this.loadingInfo = true;
    this.loadingWebsites = true;
    this.loadingUpdate = false;

    this.names = [];
    this.emails = [];
    this.selectedWebsites = [];
  }

  ngOnInit(): void {
    this.get.userInfo(this.data.id)
      .subscribe(user => {
        if (user !== null) {
          this.defaultUser = _.cloneDeep(user);
          this.userForm.controls.username.setValue(user.Username);
          this.names = _.split(user.Names, ';');
          this.emails = _.split(user.Emails, ';');

          if (user.Type === 'monitor') {
            this.userForm.controls.app.setValue('My Monitor');
            this.selectedWebsites = user.websites;
            this.websites = this.websites.concat(user.websites);

            this.get.websitesWithoutUser()
              .subscribe(websites => {
                if (websites !== null) {
                  this.websites = this.websites.concat(websites);
                  this.filteredWebsites = this.userForm.controls.websites.valueChanges.pipe(
                    startWith(null),
                    map((website: any | null) => website ? this.filterWebsite(website) : this.websites.slice()));
                }

                this.loadingWebsites = false;
              });
          } else {
            this.userForm.controls.app.setValue('Access Studies');
          }
        }

        this.loadingInfo = false;
      });

    this.userForm.get('emails').statusChanges.subscribe(status =>
     this.emailsChipList.errorState = status === 'INVALID' ? true : false);
  }

  setDefault(): void {
    this.userForm.controls.password.reset();
    this.userForm.controls.confirmPassword.reset();
    this.names = _.split(this.defaultUser.Names, ';');
    this.emails = _.split(this.defaultUser.Emails, ';');
    this.selectedWebsites = _.clone(this.defaultUser.websites);
  }

  deleteUser(): void {
    this.deleteService.user({userId: this.data.id, app: this.defaultUser.Type})
      .subscribe(success => {
        if (success !== null) {
          this.message.show('USERS_PAGE.DELETE.messages.success');
          this.dialogRef.close(true);
        }
      });
  }

  updateUser(e): void {
    e.preventDefault();

    const password = this.userForm.value.password;
    const confirmPassword = this.userForm.value.confirmPassword;

    const names = _.join(this.names, ';');
    const emails = _.join(this.emails, ';');

    const defaultWebsites = JSON.stringify(_.map(this.defaultUser.websites, 'WebsiteId'));
    const websites = JSON.stringify(_.map(this.selectedWebsites, 'WebsiteId'));

    const formData = {
      userId: this.data.id,
      password,
      confirmPassword,
      names,
      emails,
      app: this.defaultUser.Type,
      defaultWebsites,
      websites
    };

    this.update.user(formData)
      .subscribe(success => {
        if (success !== null) {
          this.userForm.controls.password.reset();
          this.userForm.controls.confirmPassword.reset();
          this.message.show('USERS_PAGE.UPDATE.messages.success');
          this.dialogRef.close(true);
        }

        this.loadingUpdate = false;
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
      this.userForm.controls.websites.setValue(null);
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
