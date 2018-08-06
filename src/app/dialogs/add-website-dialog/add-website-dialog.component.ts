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

@Component({
  selector: 'app-add-website-dialog',
  templateUrl: './add-website-dialog.component.html',
  styleUrls: ['./add-website-dialog.component.css']
})
export class AddWebsiteDialogComponent implements OnInit {

  matcher: ErrorStateMatcher;

  loadingEntities: boolean;
  loadingUsers: boolean;
  loadingTags: boolean;
  loadingCreate: boolean;

  visible: boolean = true;
  selectable: boolean = false;
  removable: boolean = true;
  addOnBlur: boolean = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredEntities: Observable<string[]>;
  filteredUsers: Observable<string[]>;
  filteredTags: Observable<any[]>;

  entities: any;
  monitorUsers: any;
  tags: any;
  selectedTags: any;

  websiteForm: FormGroup;

  @ViewChild('tagInput') tagInput: ElementRef;

  constructor(private message: MessageService) {

    this.matcher = new MyErrorStateMatcher();

    this.websiteForm = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ], this.nameValidator.bind(this)),
      domain: new FormControl('', [
        Validators.required
      ], this.domainValidator.bind(this)),
      entity: new FormControl('', [
        this.entityValidator.bind(this)
      ]),
      user: new FormControl('', [
        this.userValidator.bind(this)
      ]),
      tags: new FormControl()
    });

    this.loadingEntities = true;
    this.loadingUsers = true;
    this.loadingTags = true;
    this.loadingCreate = false;

    this.selectedTags = [];
  }

  ngOnInit(): void {
    /*this.server.userPost('/users/monitor', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.monitorUsers = data.result;
            this.filteredUsers = this.websiteForm.controls.user.valueChanges
              .pipe(
                startWith(null),
                map(val => this.filterUser(val))
              );
            break;
        }
      }, error => {
        this.message.show('MISC.messages.data_error');
        console.log(error);
      }, () => {
        this.loadingUsers = false;
      });

    this.server.userPost('/entities/all', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.entities = data.result;
            this.filteredEntities = this.websiteForm.controls.entity.valueChanges
              .pipe(
                startWith(null),
                map(val => this.filterEntity(val))
              );
            break;
        }
      }, error => {
        this.message.show('MISC.messages.data_error');
        console.log(error);
      }, () => {
        this.loadingEntities = false;
      });

    this.server.userPost('/tags/all', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.tags = data.result;
            this.filteredTags = this.websiteForm.controls.tags.valueChanges.pipe(
              startWith(null),
              map((tag: any | null) => tag ? this.filterTags(tag) : this.tags.slice()));
            break;
        }
      }, error => {
        this.message.show('MISC.messages.data_error');
        console.log(error);
      }, () => {
        this.loadingTags = false;
      });*/
  }

  resetForm(): void {
    this.websiteForm.reset();
    this.selectedTags = [];
  }

  createWebsite(e): void {
    e.preventDefault();
    
    const name = this.websiteForm.value.name;
    const domain = this.websiteForm.value.domain;
    const entityId = this.websiteForm.value.entity ? 
      _.find(this.entities, ['Long_Name', this.websiteForm.value.entity]).EntityId : null;
    const userId = this.websiteForm.value.user ? 
      _.find(this.monitorUsers, ['Email', this.websiteForm.value.user]).UserId : null;
    const tags = _.map(this.selectedTags, 'TagId');

    const formData = {
      name,
      domain,
      entityId,
      userId,
      tags
    };

    this.loadingCreate = true;

    /*this.server.userPost('/websites/create', formData)
      .subscribe((data: any) => {
        switch (data.success) {
          case 1:
            this.websiteForm.reset();
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
      });*/
  }

  removeTag(tag: any): void {
    const index = _.findIndex(this.selectedTags, tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  filterTags(name: string) {
    return this.tags.filter(tag =>
        _.includes(_.toLower(tag.Name), _.toLower(name)));
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    let index = _.findIndex(this.tags, t => { return t.Name === event.option.viewValue});
    if (!_.includes(this.selectedTags, this.tags[index])) {
      this.selectedTags.push(this.tags[index]);
      this.tagInput.nativeElement.value = '';
      this.websiteForm.controls.tags.setValue(null);
    }
  }

  filterEntity(val: any): string[] {
    return this.entities.filter(entity =>
      _.includes(_.toLower(entity.Long_Name), _.toLower(val)));
  }

  filterUser(val: any): string[] {
    return this.monitorUsers.filter(user =>
      _.includes(_.toLower(user.Email), _.toLower(val)));
  }

  nameValidator(control: AbstractControl): Promise<any> {
    const name = control.value;
    
    if (name != '') {
      return new Promise<any>((resolve, reject) => {
        /*this.server.get('/websites/existsName/' + name)
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
          });*/
      });
    } else {
      return null;
    }
  }

  domainValidator(control: AbstractControl): Promise<any> {
    const domain = control.value;
    
    if (domain != '') {
      return new Promise<any>((resolve, reject) => {
        /*this.server.get('/domains/exists/' + encodeURIComponent(domain))
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
          });*/
      });
    } else {
      return null;
    }
  }

  entityValidator(control: AbstractControl): any {
    const val = control.value;
    if (val !== '' && val !== null)
      return _.includes(_.map(this.entities, 'Long_Name'), val) ? null : { 'validEntity': true }
    else
      return null;
  }

  userValidator(control: AbstractControl): any {
    const val = control.value;
    if (val !== '' && val !== null)
      return _.includes(_.map(this.monitorUsers, 'Email'), val) ? null : { 'validUser': true }
    else
      return null;
  }
}
