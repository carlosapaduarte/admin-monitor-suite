import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as _ from 'lodash';

import { CreateService } from '../../services/create.service';
import { GetService } from '../../services/get.service';
import { VerifyService } from '../../services/verify.service';
import { UpdateService } from '../../services/update.service';
import { DeleteService } from '../../services/delete.service';
import { MessageService } from '../../services/message.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-edit-entity-dialog',
  templateUrl: './edit-entity-dialog.component.html',
  styleUrls: ['./edit-entity-dialog.component.css']
})
export class EditEntityDialogComponent implements OnInit {

  matcher: ErrorStateMatcher;

  loadingInfo: boolean;
  loadingWebsites: boolean;
  loadingUpdate: boolean;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  filteredWebsites: Observable<any[]>;

  websites: any;
  selectedWebsites: any;

  entityForm: FormGroup;

  defaultEntity: any;

  @ViewChild('websiteInput') websiteInput: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditEntityDialogComponent>,
    private create: CreateService,
    private get: GetService,
    private update: UpdateService,
    private deleteService: DeleteService,
    private verify: VerifyService,
    private message: MessageService
  ) {
    this.defaultEntity = {};
    this.websites = [];

    this.matcher = new MyErrorStateMatcher();

    this.entityForm = new FormGroup({
      shortName: new FormControl('', Validators.required),
      longName: new FormControl('', Validators.required),
      websites: new FormControl()
    });

    this.loadingInfo = true;
    this.loadingWebsites = true;
    this.loadingUpdate = false;

    this.selectedWebsites = [];
  }

  ngOnInit(): void {
    this.get.entityInfo(this.data.id)
      .subscribe(entity => {
        if (entity !== null) {
          this.defaultEntity = _.cloneDeep(entity);

          this.entityForm.controls.shortName.setValue(entity.Short_Name);
          this.entityForm.controls.longName.setValue(entity.Long_Name);
          this.selectedWebsites = entity.websites;
          this.websites = this.websites.concat(entity.websites);

          this.entityForm.controls.shortName.setAsyncValidators(this.shortNameValidator.bind(this));
          this.entityForm.controls.longName.setAsyncValidators(this.longNameValidator.bind(this));
        }

        this.loadingInfo = false;
      });

    this.get.websitesWithoutEntity()
      .subscribe(websites => {
        if (websites !== null) {
          this.websites = this.websites.concat(websites);
          this.filteredWebsites = this.entityForm.controls.websites.valueChanges.pipe(
            startWith(null),
            map((website: any | null) => website ? this.filterWebsite(website) : this.websites.slice()));
        }

        this.loadingWebsites = false;
      });
  }

  setDefault(): void {
    this.entityForm.controls.shortName.setValue(this.defaultEntity.Short_Name);
    this.entityForm.controls.longName.setValue(this.defaultEntity.Long_Name);
    this.selectedWebsites = _.clone(this.defaultEntity.websites);
  }

  deleteEntity(): void {
    this.deleteService.entity({entityId: this.data.id})
      .subscribe(success => {
        if (success !== null) {
          this.message.show('ENTITIES_PAGE.DELETE.messages.success');
          this.dialogRef.close(true);
        }
      });
  }

  updateEntity(e): void {
    e.preventDefault();

    const shortName = this.entityForm.value.shortName;
    const longName = this.entityForm.value.longName;

    const defaultWebsites = JSON.stringify(_.map(this.defaultEntity.websites, 'WebsiteId'));
    const websites = JSON.stringify(_.map(this.selectedWebsites, 'WebsiteId'));

    const formData = {
      entityId: this.data.id,
      shortName,
      longName,
      defaultWebsites,
      websites
    };

    this.loadingUpdate = true;

    this.update.entity(formData)
      .subscribe(success => {
        if (success !== null) {
          this.message.show('ENTITIES_PAGE.UPDATE.messages.success');
          this.dialogRef.close(true);
        }

        this.loadingUpdate = false;
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
    const index = _.findIndex(this.websites, w => w.Name === event.option.viewValue);
    if (!_.includes(this.selectedWebsites, this.websites[index])) {
      this.selectedWebsites.push(this.websites[index]);
      this.websiteInput.nativeElement.value = '';
      this.entityForm.controls.websites.setValue(null);
    }
  }

  shortNameValidator(control: AbstractControl): Observable<any> {
    const name = _.trim(control.value);

    if (name !== '' && name !== this.defaultEntity.Short_Name) {
      return this.verify.entityShortNameExists(name);
    } else {
      return of(null);
    }
  }

  longNameValidator(control: AbstractControl): Observable<any> {
    const name = _.trim(control.value);

    if (name !== '' && name !== this.defaultEntity.Long_Name) {
      return this.verify.entityLongNameExists(name);
    } else {
      return of(null);
    }
  }
}
