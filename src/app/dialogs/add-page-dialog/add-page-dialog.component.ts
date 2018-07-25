import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as _ from 'lodash';

import { ServerService } from '../../services/server.service';
import { MessageService } from '../../services/message.service';

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
        if (!_.startsWith(uris[i], domain)) {
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
  loadingTags: boolean;
  loadingCreate: boolean;

  visible: boolean = true;
  selectable: boolean = false;
  removable: boolean = true;
  addOnBlur: boolean = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredDomains: Observable<string[]>;
  filteredTags: Observable<any[]>;

  domains: any;
  tags: any;
  selectedTags: any;

  pageForm: FormGroup;

  @ViewChild('tagInput') tagInput: ElementRef;

  constructor(private formBuilder: FormBuilder, private server: ServerService, 
    private message: MessageService) {
    
    this.matcher = new MyErrorStateMatcher();

    this.pageForm = this.formBuilder.group({
      domain: new FormControl('', [
        Validators.required,
        this.domainValidator.bind(this)
      ]),
      uris: new FormControl('', [
        Validators.required
      ]),
      tags: new FormControl()
    },
    {
      validator: UriValidation.validUris
    });

    this.loadingDomains = true;
    this.loadingTags = true;
    this.loadingCreate = false;

    this.selectedTags = [];
  }

  ngOnInit(): void {
    this.server.userPost('/domains/all', {})
      .subscribe(data => {
        console.log(data);
        switch (data.success) {
          case 1:
            this.domains = data.result;
            this.filteredDomains = this.pageForm.controls.domain.valueChanges
              .pipe(
                startWith(null),
                map(val => this.filterDomain(val))
              );
            break;
        }
      }, error => {
        this.message.show('MISC.messages.data_error');
        console.log(error);
      }, () => {
        this.loadingDomains = false;
      });

    this.server.userPost('/tags/all', {})
      .subscribe(data => {
        console.log(data);
        switch (data.success) {
          case 1:
            this.tags = data.result;
            this.filteredTags = this.pageForm.controls.tags.valueChanges.pipe(
              startWith(null),
              map((tag: any | null) => tag ? this.filterTags(tag) : this.tags.slice()));
            break;
        }
      }, error => {
        this.message.show('MISC.messages.data_error');
        console.log(error);
      }, () => {
        this.loadingTags = false;
      });
  }

  resetForm(): void {
    this.pageForm.reset();
    this.selectedTags = [];
  }

  createPage(e): void {
    e.preventDefault();
    
    const domainId = _.find(this.domains, ['Url', this.pageForm.value.domain]).DomainId;
    const uris = this.pageForm.value.uris;
    const tags = _.map(this.selectedTags, 'TagId');
    
    const formData = {
      domainId,
      uris,
      tags
    };

    this.loadingCreate = true;

    this.server.userPost('/pages/create', formData)
      .subscribe(data => {
        console.log(data);
        switch (data.success) {
          case 1:
            this.pageForm.reset();
            this.selectedTags = [];
            this.message.show('MISC.success');
            break;
          
          default:
            this.message.show('MISC.unexpected_error');
            break;
        }
      }, (error: any) => {
        console.log(error);
        this.loadingCreate = false;
        this.message.show('MISC.unexpected_error');
      }, () => {
        this.loadingCreate = false;
      });
  }

  removeTag(tag: any): void {
    const index = _.findIndex(this.selectedTags, tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  filterTags(name: string) {
    return this.tags.filter(tag =>
        _.includes(tag.Name.toLowerCase(), name.toLowerCase()));
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    let index = _.findIndex(this.tags, t => { return t.Name === event.option.viewValue});
    if (!_.includes(this.selectedTags, this.tags[index])) {
      this.selectedTags.push(this.tags[index]);
      this.tagInput.nativeElement.value = '';
      this.pageForm.controls.tags.setValue(null);
    }
  }

  filterDomain(val: any): string[] {
    return this.domains.filter(domain =>
      _.includes(_.toLower(domain.Url), _.toLower(val)));
  }

  domainValidator(control: AbstractControl): any {
    const val = control.value;
    if (val !== '' && val !== null)
      return _.includes(_.map(this.domains, 'Url'), val) ? null : { 'validDomain': true }
    else
      return null;
  }
}