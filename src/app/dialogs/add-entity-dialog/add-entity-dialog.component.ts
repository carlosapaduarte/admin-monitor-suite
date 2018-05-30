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
  selector: 'app-add-entity-dialog',
  templateUrl: './add-entity-dialog.component.html',
  styleUrls: ['./add-entity-dialog.component.css']
})
export class AddEntityDialogComponent implements OnInit {

  matcher: ErrorStateMatcher;

  loadingWebsites: boolean;
  loadingTags: boolean;
  loadingCreate: boolean;

  visible: boolean = true;
  selectable: boolean = false;
  removable: boolean = true;
  addOnBlur: boolean = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredWebsites: Observable<any[]>;
  filteredTags: Observable<any[]>;

  websites: any;
  selectedWebsites: any;
  tags: any;
  selectedTags: any;

  entityForm: FormGroup;

  @ViewChild('websiteInput') websiteInput: ElementRef;
  @ViewChild('tagInput') tagInput: ElementRef;

  constructor(private server: ServerService, private message: MessageService) {

    this.matcher = new MyErrorStateMatcher();

    this.entityForm = new FormGroup({
      shortName: new FormControl('', [
        Validators.required
      ], this.shortNameValidator.bind(this)),
      longName: new FormControl('', [
        Validators.required
      ], this.longNameValidator.bind(this)),
      websites: new FormControl(),
      tags: new FormControl()
    });

    this.loadingWebsites = true;
    this.loadingTags = true;
    this.loadingCreate = false;

    this.selectedWebsites = [];
    this.selectedTags = [];
  }

  ngOnInit(): void {
    this.server.userPost('/websites/withoutEntity', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.websites = data.result;
            this.filteredWebsites = this.entityForm.controls.websites.valueChanges.pipe(
              startWith(null),
              map((website: any | null) => website ? this.filterWebsite(website) : this.websites.slice()));
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
            this.filteredTags = this.entityForm.controls.tags.valueChanges.pipe(
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
    this.entityForm.reset();
    this.selectedTags = [];
    this.selectedWebsites = [];
  }

  createEntity(e): void {
    e.preventDefault();
    
    const shortName = this.entityForm.value.shortName;
    const longName = this.entityForm.value.longName;
    const websites = _.map(this.selectedWebsites, 'WebsiteId');
    const tags = _.map(this.selectedTags, 'TagId');

    const formData = {
      shortName,
      longName,
      websites,
      tags
    };

    this.loadingCreate = true;

    this.server.userPost('/entities/create', formData)
      .subscribe(data => {
         switch (data.success) {
           case 1:
             this.entityForm.reset();
             this.selectedTags = [];
             this.selectedWebsites = [];
             this.message.show('MISC.success');
             break;
           
           default:
             this.message.show('MISC.unexpected_error');
             break;
         }
      }, error => {
        this.loadingCreate = false;
        this.message.show('MISC.unexpected_error');
        console.log(error);
      }, () => {
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
      this.entityForm.controls.tags.setValue(null);
    }
  }

  shortNameValidator(control: AbstractControl): Promise<any> {
    const name = control.value;
    
    if (name != '') {
      return new Promise<any>((resolve, reject) => {
        this.server.get('/entities/existsShortName/' + name)
          .subscribe(data => {
            switch (data.success) {
              case 1:
                resolve(data.result ? { 'notTakenName': true } : null);
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

  longNameValidator(control: AbstractControl): Promise<any> {
    const name = control.value;
    
    if (name != '') {
      return new Promise<any>((resolve, reject) => {
        this.server.get('/entities/existsLongName/' + name)
          .subscribe(data => {
            switch (data.success) {
              case 1:
                resolve(data.result ? { 'notTakenName': true } : null);
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
