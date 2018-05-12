import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { ServerService } from '../../services/server.service';
import { MessageService } from '../../services/message.service';

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
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  hide: boolean;
  userForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private server: ServerService, 
    private message: MessageService) {
    
    this.hide = true;

    this.userForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required
      ]),
      confirmPassword: new FormControl('', [
        Validators.required
      ]),
      app: new FormControl('', [
        Validators.required
      ]),
      websites: new FormControl()
    }, 
    {
      validator: PasswordValidation.MatchPassword
    });
  }

  ngOnInit(): void { }

  createUser(e): void {
  	e.preventDefault();
    
    const email = this.userForm.value.email;
    const password = this.userForm.value.password;
    const confirmPassword = this.userForm.value.confirmPassword;
    const app = this.userForm.value.app;
    const websites = this.userForm.value.websites;

    const formData = {
      email,
      password,
      confirmPassword,
      app
    };

    this.server.userPost('/users/create', formData)
      .subscribe((data: any) => {
        console.log(data);
      }, (error: any) => {
        console.log(error);
      }, () => {

      });
  }
}