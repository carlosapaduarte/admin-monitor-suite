import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { ServerService } from '../../services/server.service';
import { MessageService } from '../../services/message.service';

import { AddTagDialogComponent } from '../../dialogs/add-tag-dialog/add-tag-dialog.component';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.css']
})
export class AddTagComponent implements OnInit {

  tagForm: FormGroup;
  entities: any;
  websites: any;
  domains: any;
  pages: any;

  constructor(private dialog: MatDialog, private server: ServerService, private message: MessageService) {
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
  }

  ngOnInit() {
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

      });

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

      });

    this.server.userPost('/domains/all', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.domains = data.result;
            break;
        }
      }, error => {
        this.message.show('MISC.messages.data_error');
        console.log(error);
      }, () => {

      });

    this.server.userPost('/pages/all', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.pages = data.result;
            break;
        }
      }, error => {
        this.message.show('MISC.messages.data_error');
        console.log(error);
      }, () => {

      });
  }

  createWebsite(e): void {
    e.preventDefault();
    
    const name = this.tagForm.value.name;
    const observatorio = this.tagForm.value.observatorio;
    const entities = this.tagForm.value.entities;
    const websites = this.tagForm.value.websites;
    const domains = this.tagForm.value.domains;
    const pages = this.tagForm.value.pages;

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

  openDialog(): void {
    this.dialog.open(AddTagDialogComponent, {
      width: '80vw'
    });
  }
}
