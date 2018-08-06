import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	// creates a reference to the first input element
  @ViewChild('emailEle') private emailElement: ElementRef;

  // shows and hides the password
  hide: boolean;

  // shows loading spinner while waiting
  loginLoading: boolean;

  // login form
  loginForm: FormGroup;

  constructor(private user: UserService) {

    this.hide = true;
    this.loginLoading = false;

    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngOnInit(): void {
    // focus the first email input box when the page is loaded
    this.emailElement.nativeElement.focus();
  }

  login(): void {
    this.loginLoading = true;

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.user.login(email, password)
      .subscribe(() => this.loginLoading = false);
  }
}