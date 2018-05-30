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

@Component({
  selector: 'app-add-domain-dialog',
  templateUrl: './add-domain-dialog.component.html',
  styleUrls: ['./add-domain-dialog.component.css']
})
export class AddDomainDialogComponent implements OnInit {

  matcher: ErrorStateMatcher;

  loadingWebsites: boolean;
  loadingTags: boolean;
  loadingCreate: boolean;
  showCurrentDomain: boolean;

  visible: boolean = true;
  selectable: boolean = false;
  removable: boolean = true;
  addOnBlur: boolean = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredWebsites: Observable<string[]>;
  filteredTags: Observable<any[]>;

  websites: any;
  tags: any;
  selectedTags: any;

  domainForm: FormGroup;

  @ViewChild('tagInput') tagInput: ElementRef;

  constructor(private server: ServerService, private message: MessageService) {

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
      ], this.domainValidator.bind(this)),
      tags: new FormControl()
    });

    this.loadingWebsites = true;
    this.loadingTags = true;
    this.loadingCreate = false;
    this.showCurrentDomain = false;

    this.selectedTags = [];
  }

  ngOnInit(): void {
    this.server.userPost('/websites/all', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.websites = data.result;
            this.filteredWebsites = this.domainForm.controls.website.valueChanges
              .pipe(
                startWith(null),
                map(val => this.filterWebsite(val))
              );
            break;
        }
      }, error => {
        this.message.show('MISC.messages.data_error');
        console.log(error);
      }, () => {
        this.loadingWebsites = false;
      });

    this.server.userPost('/tags/all', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.tags = data.result;
            this.filteredTags = this.domainForm.controls.tags.valueChanges.pipe(
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
    this.domainForm.reset();
    this.selectedTags = [];
  }

  getCurrentDomain(): void {
    const websiteId = _.find(this.websites, ['Name', this.domainForm.value.website]).WebsiteId;

    this.server.get('/websites/activeDomain/' + websiteId)
      .subscribe((data: any) => {
        console.log(data);
        switch (data.success) {
          case 1:
            this.domainForm.controls.current_domain.setValue(data.result[0].Url);
            this.showCurrentDomain = true;
            break;
        }
      }, (error: any) => {
        console.log(error);
      }, () => {

      });
  }

  createDomain(e): void {
    e.preventDefault();
    
    const websiteId = _.find(this.websites, ['Name', this.domainForm.value.website]).WebsiteId;
    const url = this.domainForm.value.url;
    const tags = _.map(this.selectedTags, 'TagId');
    
    const formData = {
      websiteId,
      url,
      tags
    };

    this.loadingCreate = true;

    this.server.userPost('/domains/create', formData)
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.domainForm.reset();
            this.selectedTags = [];
            this.message.show('MISC.success');
            break;
          
          default:
            this.message.show('MISC.unexpected_error');
            break;
        }
      }, error => {
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
      this.domainForm.controls.tags.setValue(null);
    }
  }

  filterWebsite(val: any): string[] {
    return this.websites.filter(website =>
      _.includes(_.toLower(website.Name), _.toLower(val)));
  }

  websiteValidator(control: AbstractControl): any {
    const val = control.value;
    if (val !== '' && val !== null)
      return _.includes(_.map(this.websites, 'Name'), val) ? null : { 'validWebsite': true }
    else
      return null;
  }

  urlValidator(control: AbstractControl): any {
    let url = control.value;

    if (url === '' || url === null)
      return null;

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

  domainValidator(control: AbstractControl): Promise<any> {
    const domain = control.value;
    
    if (domain != '') {
      return new Promise<any>((resolve, reject) => {
        this.server.get('/domains/exists/' + encodeURIComponent(domain))
          .subscribe(data => {
            switch (data.success) {
              case 1:
                resolve(data.result ? { 'notTakenDomain': true } : null);
                break;
              
              default:
                reject(null);
                break;
            }
          }, error => {
            console.log(error);
            reject(null);
          });
      });
    } else {
      return null;
    }
  }
}
