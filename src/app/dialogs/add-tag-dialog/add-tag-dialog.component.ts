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
  selector: 'app-add-tag-dialog',
  templateUrl: './add-tag-dialog.component.html',
  styleUrls: ['./add-tag-dialog.component.css']
})
export class AddTagDialogComponent implements OnInit {

  loadingEntities: boolean;
  loadingWebsites: boolean;
  loadingDomains: boolean;
  loadingPages: boolean;

  visible: boolean = true;
  selectable: boolean = false;
  removable: boolean = true;
  addOnBlur: boolean = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredEntities: Observable<any[]>;
  filteredWebsites: Observable<any[]>;
  filteredDomains: Observable<any[]>;
  filteredPages: Observable<any[]>;

  @ViewChild('entityInput') entityInput: ElementRef;
  @ViewChild('websiteInput') websiteInput: ElementRef;
  @ViewChild('domainInput') domainInput: ElementRef;
  @ViewChild('pageInput') pageInput: ElementRef;

  tagForm: FormGroup;
  entities: any;
  selectedEntities: any;
  websites: any;
  selectedWebsites: any;
  domains: any;
  selectedDomains: any;
  pages: any;
  selectedPages: any;

  constructor(private server: ServerService, private message: MessageService) {
    this.tagForm = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ]),
      observatorio: new FormControl(),
      entities: new FormControl(),
      websites: new FormControl();
      domains: new FormControl(),
      pages: new FormControl()
    });

    this.selectedEntities = [];
    this.selectedWebsites = [];
    this.selectedDomains = [];
    this.selectedPages = [];

    this.loadingEntities = true;
    this.loadingWebsites = true;
    this.loadingDomains = true;
    this.loadingPages = true;
  }

  ngOnInit() {
    this.server.userPost('/entities/all', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.entities = data.result;
            this.filteredEntities = this.tagForm.controls.entities.valueChanges.pipe(
              startWith(null),
              map((entity: any | null) => entity ? this.filterEntity(entity) : this.entities.slice()));
            break;
        }
      }, error => {
        this.message.show('MISC.messages.data_error');
        console.log(error);
      }, () => {
        this.loadingEntities = false;
      });

    this.server.userPost('/websites/all', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.websites = data.result;
            this.filteredWebsites = this.tagForm.controls.websites.valueChanges.pipe(
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

    this.server.userPost('/domains/all', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.domains = data.result;
            this.filteredDomains = this.tagForm.controls.domains.valueChanges.pipe(
              startWith(null),
              map((domain: any | null) => domain ? this.filterDomains(domain) : this.domains.slice()));
            break;
        }
      }, error => {
        this.message.show('MISC.messages.data_error');
        console.log(error);
      }, () => {
        this.loadingDomains = false;
      });

    this.server.userPost('/pages/all', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.pages = data.result;
            this.filteredPages = this.tagForm.controls.pages.valueChanges.pipe(
              startWith(null),
              map((page: any | null) => page ? this.filterPages(page) : this.pages.slice()));
            break;
        }
      }, error => {
        this.message.show('MISC.messages.data_error');
        console.log(error);
      }, () => {
        this.loadingPages = false;
      });
  }

  createTag(e): void {
    e.preventDefault();
    
    const name = this.tagForm.value.name;
    const observatorio = this.tagForm.value.observatorio;
    const entities = _.map(this.selectedEntities, 'EntityId');
    const websites = _.map(this.selectedWebsites, 'WebsiteId');
    const domains = _.map(this.selectedDomains, 'DomainId');
    const pages = _.map(this.selectedPages, 'PageId');

    const formData = {
      name,
      observatorio,
      entities,
      websites,
      domains,
      pages
    };

    this.server.userPost('/tags/create', formData)
      .subscribe((data: any) => {
        console.log(data);
      }, (error: any) => {
        console.log(error);
      }, () => {

      });
  }

  removeEntity(entity: any): void {
    const index = _.findIndex(this.selectedEntities, entity);

    if (index >= 0) {
      this.selectedEntities.splice(index, 1);
    }
  }

  filterEntity(name: string) {
    return this.entities.filter(entity =>
        _.includes(entity.Long_Name.toLowerCase(), name.toLowerCase()));
  }

  selectedEntity(event: MatAutocompleteSelectedEvent): void {
    let index = _.findIndex(this.entities, e => { return e.Long_Name === event.option.viewValue});
    if (!_.includes(this.selectedEntities, this.entities[index])) {
      this.selectedEntities.push(this.entities[index]);
      this.entityInput.nativeElement.value = '';
      this.tagForm.controls.entities.setValue(null);
    }
  }

  removeWebsite(website: any): void {
    const index = _.findIndex(this.selectedWebsites, website);

    if (index >= 0) {
      this.selectedWebsites.splice(index, 1);
    }
  }

  filterWebsite(name: string) {
    return this.websites.filter(website =>
        _.includes(website.Long_Name.toLowerCase(), name.toLowerCase()));
  }

  selectedWebsite(event: MatAutocompleteSelectedEvent): void {
    let index = _.findIndex(this.websites, w => { return w.Long_Name === event.option.viewValue});
    if (!_.includes(this.selectedWebsites, this.websites[index])) {
      this.selectedWebsites.push(this.websites[index]);
      this.websiteInput.nativeElement.value = '';
      this.tagForm.controls.websites.setValue(null);
    }
  }

  removeDomain(domain: any): void {
    const index = _.findIndex(this.selectedDomains, domain);

    if (index >= 0) {
      this.selectedDomains.splice(index, 1);
    }
  }

  filterDomains(name: string) {
    return this.domains.filter(domain =>
        _.includes(domain.Url.toLowerCase(), name.toLowerCase()));
  }

  selectedDomain(event: MatAutocompleteSelectedEvent): void {
    let index = _.findIndex(this.domains, d => { return d.Url === event.option.viewValue});
    if (!_.includes(this.selectedDomains, this.domains[index])) {
      this.selectedDomains.push(this.domains[index]);
      this.domainInput.nativeElement.value = '';
      this.tagForm.controls.domains.setValue(null);
    }
  }

  removePage(page: any): void {
    const index = _.findIndex(this.selectedPages, page);

    if (index >= 0) {
      this.selectedPages.splice(index, 1);
    }
  }

  filterPages(name: string) {
    return this.pages.filter(page =>
        _.includes(page.Uri.toLowerCase(), name.toLowerCase()));
  }

  selectedPage(event: MatAutocompleteSelectedEvent): void {
    let index = _.findIndex(this.pages, p => { return p.Uri === event.option.viewValue});
    if (!_.includes(this.selectedPages, this.pages[index])) {
      this.selectedPages.push(this.pages[index]);
      this.pageInput.nativeElement.value = '';
      this.tagForm.controls.pages.setValue(null);
    }
  }
}
