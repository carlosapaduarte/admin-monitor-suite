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
  selector: 'app-add-domain-dialog',
  templateUrl: './add-domain-dialog.component.html',
  styleUrls: ['./add-domain-dialog.component.css']
})
export class AddDomainDialogComponent implements OnInit {

  loadingWebsites: boolean;
  loadingTags: boolean;

  visible: boolean = true;
  selectable: boolean = false;
  removable: boolean = true;
  addOnBlur: boolean = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredTags: Observable<any[]>;

  websites: any;
  tags: any;
  selectedTags: any;

  domainForm: FormGroup;

  @ViewChild('tagInput') tagInput: ElementRef;

  constructor(private server: ServerService, private message: MessageService) {
    this.domainForm = new FormGroup({
      website: new FormControl('', [
        Validators.required
      ]),
      url: new FormControl('', [
        Validators.required
      ]),
      tags: new FormControl()
    });

    this.loadingWebsites = true;
    this.loadingTags = true;

    this.selectedTags = [];
  }

  ngOnInit(): void {
    this.server.userPost('/websites/all', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.websites = data.result;
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

  createDomain(e): void {
    e.preventDefault();
    
    const websiteId = _.find(this.websites, ['Long_Name', this.domainForm.value.website]).WebsiteId;
    const url = this.domainForm.value.url;
    const tags = _.map(this.selectedTags, 'TagId');
    
    const formData = {
      websiteId,
      url,
      tags
    };

    this.server.userPost('/domains/create', formData)
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
      this.domainForm.controls.tags.setValue(null);
    }
  }
}
