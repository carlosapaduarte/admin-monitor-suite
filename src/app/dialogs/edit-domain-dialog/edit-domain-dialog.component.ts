import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, ValidationErrors, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';

import { VerifyService } from '../../services/verify.service';
import { UpdateService } from '../../services/update.service';
import { MessageService } from '../../services/message.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-edit-domain-dialog',
  templateUrl: './edit-domain-dialog.component.html',
  styleUrls: ['./edit-domain-dialog.component.css']
})
export class EditDomainDialogComponent implements OnInit {

  matcher: ErrorStateMatcher;

  loadingUpdate: boolean;

  domainForm: FormGroup;

  constructor(
     @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditDomainDialogComponent>,
    private update: UpdateService,
    private verify: VerifyService,
    private message: MessageService
  ) {
    this.matcher = new MyErrorStateMatcher();

    this.domainForm = new FormGroup({
      url: new FormControl(data.url, [Validators.required, domainValidator], this.domainValidator.bind(this))
    });

    this.loadingUpdate = false;
  }

  ngOnInit(): void {
  }

  updateDomain(e): void {
    e.preventDefault();

    const url = this.domainForm.value.url;

    this.loadingUpdate = true;

    this.update.domain({domainId: this.data.domainId, url})
      .subscribe(success => {
        if (success !== null) {
          this.message.show('DOMAINS_PAGE.UPDATE.messages.success');
          this.dialogRef.close(true);
        }

        this.loadingUpdate = false;
      });
  }

  setDefault(): void {
    this.domainForm.controls.url.setValue(this.data.url);
  }

  domainValidator(control: AbstractControl): Observable<any> {
    const domain = _.trim(control.value);

    if (domain !== '' && domain !== this.data.url) {
      return this.verify.domainExists(domain);
    } else {
      return of(null);
    }
  }
}

function domainValidator(control: FormControl): ValidationErrors | null {
  let domain = _.trim(control.value);
  domain = _.replace(domain, 'http://', '');
  domain = _.replace(domain, 'https://', '');
  domain = _.replace(domain, 'www.', '');

  let invalid = false;
  if (domain === '') {
    return null;
  }

  invalid = !_.includes(domain, '.');
  invalid = invalid || _.includes(domain, '/');

  return invalid ? { invalidDomain: true } : null;
}
