import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
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
  selector: 'app-add-entity-dialog',
  templateUrl: './add-entity-dialog.component.html',
  styleUrls: ['./add-entity-dialog.component.css']
})
export class AddEntityDialogComponent implements OnInit {

  matcher: ErrorStateMatcher;

  loadingWebsites: boolean;
  loadingCreate: boolean;

  visible: boolean = true;
  selectable: boolean = false;
  removable: boolean = true;
  addOnBlur: boolean = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredWebsites: Observable<any[]>;

  websites: any;
  selectedWebsites: any;

  entityForm: FormGroup;

  @ViewChild('websiteInput') websiteInput: ElementRef;

  constructor(
    private create: CreateService,
    private get: GetService,
    private verify: VerifyService,
    private message: MessageService
  ) {
    this.matcher = new MyErrorStateMatcher();

    this.entityForm = new FormGroup({
      shortName: new FormControl('', [
        Validators.required
      ], this.shortNameValidator.bind(this)),
      longName: new FormControl('', [
        Validators.required
      ], this.longNameValidator.bind(this)),
      websites: new FormControl()
    });

    this.loadingWebsites = true;
    this.loadingCreate = false;

    this.selectedWebsites = [];
  }

  ngOnInit(): void {
    this.get.websitesWithoutEntity()
      .subscribe(websites => {
        if (websites !== null) {
          this.websites = websites;
          this.filteredWebsites = this.entityForm.controls.websites.valueChanges.pipe(
            startWith(null),
            map((website: any | null) => website ? this.filterWebsite(website) : this.websites.slice()));
        }

        this.loadingWebsites = false;
      })
  }

  resetForm(): void {
    this.entityForm.reset();
    this.selectedWebsites = [];
  }

  createEntity(e): void {
    e.preventDefault();
    
    const shortName = this.entityForm.value.shortName;
    const longName = this.entityForm.value.longName;
    const websites = JSON.stringify(_.map(this.selectedWebsites, 'WebsiteId'));

    const formData = {
      shortName,
      longName,
      websites
    };

    this.loadingCreate = true;

    this.create.newEntity(formData)
      .subscribe(success => {
        if (success !== null) {
          if (success) {
            this.entityForm.reset();
            this.selectedWebsites = [];
            this.message.show('ENTITIES_PAGE.ADD.messages.success');
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
    let index = _.findIndex(this.websites, w => { return w.Name === event.option.viewValue});
    if (!_.includes(this.selectedWebsites, this.websites[index])) {
      this.selectedWebsites.push(this.websites[index]);
      this.websiteInput.nativeElement.value = '';
      this.entityForm.controls.websites.setValue(null);
    }
  }

  shortNameValidator(control: AbstractControl): Observable<any> {
    const name = _.trim(control.value);
    
    if (name !== '') {
      return this.verify.entityShortNameExists(name);
    } else {
      return null;
    }
  }

  longNameValidator(control: AbstractControl): Observable<any> {
    const name = _.trim(control.value);
    
    if (name !== '') {
      return this.verify.entityLongNameExists(name);
    } else {
      return null;
    }
  }
}
