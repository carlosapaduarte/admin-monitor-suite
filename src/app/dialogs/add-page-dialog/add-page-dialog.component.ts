import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as _ from 'lodash';

import { GetService } from '../../services/get.service';
import { CreateService } from '../../services/create.service';
import { MessageService } from '../../services/message.service';

import {
  ChooseObservatoryPagesDialogComponent
} from '../choose-observatory-pages-dialog/choose-observatory-pages-dialog.component';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export class UriValidation {

  static validUris(AC: AbstractControl) {
    const domain = AC.get('domain').value;
    let uris = AC.get('uris').value;

    if (_.trim(domain) === '') {
      return null;
    }

    if (_.trim(uris) !== '') {
      uris = _.without(_.uniq(_.split(uris, '\n')), '');
      const size = _.size(uris);
      let hasError = false;
      for (let i = 0 ; i < size ; i++) {
        let url = _.replace(uris[i], 'http://', '');
        url = _.replace(url, 'https://', '');
        url = _.replace(url, 'www.', '');

        if (!_.startsWith(url, domain)) {
          AC.get('uris').setErrors({ 'invalidUri' : true });
          hasError = true;
        }
      }
      if (!hasError) {
        return null;
      }
    } else {
      return null;
    }
  }
}

@Component({
  selector: 'app-add-page-dialog',
  templateUrl: './add-page-dialog.component.html',
  styleUrls: ['./add-page-dialog.component.css']
})
export class AddPageDialogComponent implements OnInit {

  matcher: ErrorStateMatcher;

  loadingDomains: boolean;
  loadingCreate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredDomains: Observable<string[]>;

  domains: any;

  pageForm: FormGroup;

  @ViewChild('tagInput') tagInput: ElementRef;

  constructor(
    private get: GetService,
    private create: CreateService,
    private message: MessageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddPageDialogComponent>
  ) {
    this.matcher = new MyErrorStateMatcher();

    this.pageForm = this.formBuilder.group({
      domain: new FormControl('', [
        Validators.required,
        this.domainValidator.bind(this)
      ]),
      uris: new FormControl('', [
        Validators.required
      ]),
      observatorio: new FormControl()
    },
    {
      validator: UriValidation.validUris
    });

    this.loadingDomains = true;
    this.loadingCreate = false;
  }

  ngOnInit(): void {
    this.get.listOfOfficialDomains()
      .subscribe(domains => {
        if (domains !== null) {
          this.domains = domains;
          this.filteredDomains = this.pageForm.controls.domain.valueChanges
            .pipe(
              startWith(null),
              map(val => this.filterDomain(val))
            );
        }

        this.loadingDomains = false;
      });
  }

  resetForm(): void {
    this.pageForm.reset();
  }

  createPage(e): void {
    e.preventDefault();

    const domainId = _.find(this.domains, ['Url', this.pageForm.value.domain]).DomainId;
    const uris = JSON.stringify(_.without(_.uniq(_.map(_.split(this.pageForm.value.uris, '\n'), p => {
      p = _.replace(p, 'http://', '');
      p = _.replace(p, 'https://', '');
      p = _.replace(p, 'www.', '');

      if (p[_.size(p)-1] === '/') {
        p = p.substring(0, _.size(p)-1);
      }

      return _.trim(p);
    })), ''));

    if (this.pageForm.value.observatorio) {
      let chooseDialog = this.dialog.open(ChooseObservatoryPagesDialogComponent, {
        width: '60vw',
        data: {
          uris: JSON.parse(uris)
        }
      });

      chooseDialog.afterClosed().subscribe(result => {
        if (!result.cancel) {
          this.addPages(domainId, uris, result.uris);
        }
      });
    } else {
      this.addPages(domainId, uris, JSON.stringify([]));
    }
  }

  private addPages(domainId: number, uris: any, observatorio: any): void {
    this.loadingCreate = true;

    const formData = {
      domainId,
      uris,
      observatorio
    };

    this.create.newPages(formData)
      .subscribe(success => {
        if (success !== null) {
          if (success) {
            this.message.show('PAGES_PAGE.ADD.messages.success');

            if (this.location.path() !== '/console/pages') {
              this.router.navigateByUrl('/console/pages');
            } else {
              window.location.reload();
            }

            this.dialogRef.close();
          }
        }

        this.loadingCreate = false;
      });
  }

  filterDomain(val: any): string[] {
    return this.domains.filter(domain =>
      _.includes(_.toLower(domain.Url), _.toLower(val)));
  }

  domainValidator(control: AbstractControl): any {
    const val = control.value;
    if (val !== '' && val !== null) {
      return _.includes(_.map(this.domains, 'Url'), val) ? null : { 'validDomain': true };
    } else {
      return null;
    }
  }
}
