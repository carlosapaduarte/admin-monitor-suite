import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as _ from 'lodash';

import { ServerService } from '../../services/server.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-add-website-dialog',
  templateUrl: './add-website-dialog.component.html',
  styleUrls: ['./add-website-dialog.component.css']
})
export class AddWebsiteDialogComponent implements OnInit {

  loadingEntities: boolean;
  loadingUsers: boolean;
  loadingTags: boolean;

  visible: boolean = true;
  selectable: boolean = false;
  removable: boolean = true;
  addOnBlur: boolean = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredTags: Observable<any[]>;

  entities: any;
  monitorUsers: any;
  tags: any;
  selectedTags: any;

  websiteForm: FormGroup;

  @ViewChild('tagInput') tagInput: ElementRef;

  constructor(private server: ServerService, private message: MessageService) {
    this.websiteForm = new FormGroup({
      shortName: new FormControl('', [
        Validators.required
      ]),
      longName: new FormControl('', [
        Validators.required
      ]),
      domain: new FormControl('', [
        Validators.required
      ]),
      entity: new FormControl(),
      user: new FormControl(),
      tags: new FormControl()
    });

    this.loadingEntities = true;
    this.loadingUsers = true;
    this.loadingTags = true;

    this.selectedTags = [];
  }

  ngOnInit(): void {
    this.server.userPost('/users/monitor', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.monitorUsers = data.result;
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
      });
  }

  resetForm(): void {
    this.websiteForm.reset();
    this.selectedTags = [];
  }

  createWebsite(e): void {
    e.preventDefault();
    
    const shortName = this.websiteForm.value.shortName;
    const longName = this.websiteForm.value.longName;
    const domain = this.websiteForm.value.domain;
    const entityId = this.websiteForm.value.entity;
    const userId = this.websiteForm.value.user;
    const tags = _.map(this.websiteForm.value.tags, 'TagId');

    const formData = {
      shortName,
      longName,
      domain,
      entityId,
      userId,
      tags
    };

    this.server.userPost('/websites/create', formData)
      .subscribe((data: any) => {
        console.log(data);
      }, (error: any) => {
        console.log(error);
      }, () => {

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
      this.websiteForm.controls.tags.setValue(null);
    }
  }
}
