import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as _ from 'lodash';

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

  loadingWebsites: boolean;

  matcher: ErrorStateMatcher;

  visible: boolean = true;
  selectable: boolean = false;
  removable: boolean = true;
  addOnBlur: boolean = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredWebsites: Observable<any[]>;

  websites: any;
  selectedWebsites: any;

  hide: boolean;
  hide2: boolean;
  userForm: FormGroup;

  @ViewChild('websiteInput') websiteInput: ElementRef;

  constructor(private formBuilder: FormBuilder, 
    private message: MessageService) { 

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

    this.selectedWebsites= [];
  }

  ngOnInit(): void {
    /*this.server.userPost('/websites/withoutUser', {})
      .subscribe(data => {
        console.log(data);
        switch (data.success) {
          case 1:
            this.websites = data.result;
            this.filteredWebsites = this.userForm.controls.websites.valueChanges.pipe(
              startWith(null),
              map((website: any | null) => website ? this.filterWebsite(website) : this.websites.slice()));
            break;
        }
      }, error => {
        this.message.show('MISC.messages.data_error');
        console.log(error);
      }, () => {
        this.loadingWebsites = false;
      });*/
  }

  changeApp(): void {
    if (_.isEqual(this.userForm.value.app, 'monitor'))
      this.userForm.controls.websites.enable();
    else {
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

    /*this.server.userPost('/users/create', formData)
      .subscribe((data: any) => {
        console.log(data);
      }, (error: any) => {
        console.log(error);
      }, () => {

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
    let index = _.findIndex(this.websites, w => { return w.Name === event.option.viewValue});
    if (!_.includes(this.selectedWebsites, this.websites[index])) {
      this.selectedWebsites.push(this.websites[index]);
      this.websiteInput.nativeElement.value = '';
      this.userForm.controls.websites.setValue(null);
    }
  }

  emailValidator(control: AbstractControl): Promise<any> {
    const email = control.value;
    
    if (email != '') {
      return new Promise<any>((resolve, reject) => {
        /*this.server.get('/users/exists/' + email)
          .subscribe(data => {
            switch (data.success) {
              case 1:
                resolve(data.result ? { 'notTakenEmail': true } : null);
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