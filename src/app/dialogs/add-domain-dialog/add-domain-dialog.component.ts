import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as _ from 'lodash';

import { GetService } from '../../services/get.service';
import { VerifyService } from '../../services/verify.service';
import { CreateService } from '../../services/create.service';
import { MessageService } from '../../services/message.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-domain-dialog',
  templateUrl: './add-domain-dialog.component.html',
  styleUrls: ['./add-domain-dialog.component.css']
})
export class AddDomainDialogComponent implements OnInit {

  matcher: ErrorStateMatcher;

  loadingWebsites: boolean;
  loadingCreate: boolean;
  showCurrentDomain: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredWebsites: Observable<string[]>;

  websites: any;

  domainForm: FormGroup;

  @ViewChild('tagInput') tagInput: ElementRef;

  constructor(
    private get: GetService,
    private verify: VerifyService,
    private create: CreateService,
    private message: MessageService,
    private router: Router,
    private location: Location,
    private dialogRef: MatDialogRef<AddDomainDialogComponent>
  ) {
    this.matcher = new MyErrorStateMatcher();

    this.domainForm = new FormGroup({
      website: new FormControl('', [
        Validators.required,
        this.websiteValidator.bind(this)
      ]),
      current_domain: new FormControl({value: '', disabled: true}),
      url: new FormControl('', [
        Validators.required,
        this.urlValidator.bind(this)
      ], this.domainValidator.bind(this))
    });

    this.loadingWebsites = true;
    this.loadingCreate = false;
    this.showCurrentDomain = false;
  }

  ngOnInit(): void {
    this.get.listOfOfficialWebsites()
      .subscribe(websites => {
        if (websites !== null) {
          this.websites = websites;
          this.filteredWebsites = this.domainForm.controls.website.valueChanges
            .pipe(
              startWith(null),
              map(val => this.filterWebsite(val))
            );
        }

        this.loadingWebsites = false;
      });
  }

  resetForm(): void {
    this.domainForm.reset();
  }

  getCurrentDomain(): void {
    const websiteId = _.find(this.websites, ['Name', this.domainForm.value.website]).WebsiteId;
    this.get.websiteCurrentDomain(websiteId)
      .subscribe(domain => {
        if (domain !== null && domain !== '') {
          this.domainForm.controls.current_domain.setValue(domain);
          this.showCurrentDomain = true;
        }
      });
  }

  createDomain(e): void {
    e.preventDefault();

    const websiteId = _.find(this.websites, ['Name', this.domainForm.value.website]).WebsiteId;
    const url = encodeURIComponent(_.trim(this.domainForm.value.url));

    const formData = {
      websiteId,
      url
    };

    this.loadingCreate = true;

    this.create.newDomain(formData)
      .subscribe(success => {
        if (success !== null) {
          if (success) {
            this.message.show('MISC.success');

            if (this.location.path() !== '/console/domains') {
              this.router.navigateByUrl('/console/domains');
            } else {
              window.location.reload();
            }

            this.dialogRef.close();
          }
        }

        this.loadingCreate = false;
      });
  }

  filterWebsite(val: any): string[] {
    return this.websites.filter(website =>
      _.includes(_.toLower(website.Name), _.toLower(val)));
  }

  websiteValidator(control: AbstractControl): any {
    const val = control.value;
    if (val !== '' && val !== null) {
      return _.includes(_.map(this.websites, 'Name'), val) ? null : { 'validWebsite': true };
    } else {
      return null;
    }
  }

  urlValidator(control: AbstractControl): any {
    let url = control.value;

    if (url === '' || url === null) {
      return null;
    }

    if (!_.startsWith(url, 'http://') && !_.startsWith(url, 'https://') && !_.startsWith(url, 'www.')) {
      if (_.includes(url, '.') && url[_.size(url) - 1] !== '.') {
        if (!_.includes(url, '/')) {
          return null;
        }
      }
    } else if (_.startsWith(url, 'http://')) {
      url = _.replace(url, 'http://', '');
      if (_.includes(url, '.') && url[_.size(url) - 1] !== '.') {
        if (!_.includes(url, '/')) {
          return null;
        }
      }
    } else if (_.startsWith(url, 'https://')) {
      url = _.replace(url, 'https://', '');
      if (_.includes(url, '.') && url[_.size(url) - 1] !== '.') {
        if (!_.includes(url, '/')) {
          return null;
        }
      }
    } else if (_.startsWith(url, 'www.')) {
      url = _.replace(url, 'www.', '');
      if (_.includes(url, '.') && url[_.size(url) - 1] !== '.') {
        if (!_.includes(url, '/')) {
          return null;
        }
      }
    }

    return { 'url': true };
  }

  domainValidator(control: AbstractControl): Observable<any> {
    const domain = _.trim(control.value);

    if (domain !== '') {
      return this.verify.domainExists(domain);
    } else {
      return null;
    }
  }
}
