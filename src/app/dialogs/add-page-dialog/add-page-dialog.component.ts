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
  selector: 'app-add-page-dialog',
  templateUrl: './add-page-dialog.component.html',
  styleUrls: ['./add-page-dialog.component.css']
})
export class AddPageDialogComponent implements OnInit {

  loadingDomains: boolean;
  loadingTags: boolean;

  visible: boolean = true;
  selectable: boolean = false;
  removable: boolean = true;
  addOnBlur: boolean = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredTags: Observable<any[]>;

  domains: any;
  tags: any;
  selectedTags: any;

  pageForm: FormGroup;

  @ViewChild('tagInput') tagInput: ElementRef;

  constructor(private server: ServerService, private message: MessageService) {
    this.pageForm = new FormGroup({
      domainId: new FormControl('', [
        Validators.required
      ]),
      uri: new FormControl('', [
        Validators.required
      ]),
      tags: new FormControl()
    });

    this.loadingDomains = true;
    this.loadingTags = true;

    this.selectedTags = [];
  }

  ngOnInit(): void {
    this.server.userPost('/domains/all', {})
      .subscribe(data => {
        console.log(data);
        switch (data.success) {
          case 1:
            this.domains = data.result;
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
    
    const domainId = this.pageForm.value.domainId;
    const uri = this.pageForm.value.uri;
    const tags = _.map(this.selectedTags, 'TagId');
    
    const formData = {
      domainId,
      uri,
      tags
    };

    this.server.userPost('/pages/create', formData)
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
      this.pageForm.controls.tags.setValue(null);
    }
  }
}
