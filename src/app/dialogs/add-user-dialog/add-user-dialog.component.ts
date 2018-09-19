import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
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

  loadingCreate: boolean;
  loadingWebsites: boolean;

  matcher: ErrorStateMatcher;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredWebsites: Observable<any[]>;

  websites: any;
  selectedWebsites: any;

  hide: boolean;
  hide2: boolean;
  userForm: FormGroup;

  @ViewChild('websiteInput') websiteInput: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private get: GetService,
    private create: CreateService,
    private verify: VerifyService,
    private message: MessageService
  ) {
    this.loadingCreate = false;
    this.hide = true;
    this.hide2 = true;

    this.matcher = new MyErrorStateMatcher();

    this.userForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ], this.emailValidator.bind(this)),
      password: new FormControl('', [
        Validators.required
      ]),
      confirmPassword: new FormControl('', [
        Validators.required
      ]),
      app: new FormControl('', [
        Validators.required
      ]),
      websites: new FormControl({value: '', disabled: true})
    },
    {
      validator: PasswordValidation.MatchPassword
    });

    this.selectedWebsites = [];
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
  }

  changeApp(): void {
    if (_.isEqual(this.userForm.value.app, 'monitor')) {
      this.userForm.controls.websites.enable();
    } else {
      this.userForm.controls.websites.reset();
      this.userForm.controls.websites.disable();
    }
  }

  resetForm(): void {
    this.userForm.reset();
    this.selectedWebsites = [];
  }

  createUser(e): void {
    e.preventDefault();

    this.loadingCreate = true;

    const email = this.userForm.value.email;
    const password = this.userForm.value.password;
    const confirmPassword = this.userForm.value.confirmPassword;
    const app = this.userForm.value.app;
    const websites = _.map(this.selectedWebsites, 'WebsiteId');

    const formData = {
      email,
      password,
      confirmPassword,
      app,
      websites
    };

    this.create.newUser(formData)
      .subscribe(success => {
        if (success !== null) {
          if (success) {
            this.message.show('USERS_PAGE.ADD.messages.success');
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
      this.userForm.controls.websites.setValue(null);
    }
  }

  emailValidator(control: AbstractControl): Observable<any> {
    const email = _.trim(control.value);

    if (email !== '') {
      return this.verify.userExists(email);
    } else {
      return null;
    }
  }
}
