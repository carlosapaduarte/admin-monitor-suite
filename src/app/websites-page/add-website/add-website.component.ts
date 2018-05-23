import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { ServerService } from '../../services/server.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-add-website',
  templateUrl: './add-website.component.html',
  styleUrls: ['./add-website.component.css']
})
export class AddWebsiteComponent implements OnInit {

	websiteForm: FormGroup;
  entities: any;
  monitorUsers: any;
  tags: any;

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
      ]);
  		entity: new FormControl(),
  		user: new FormControl(),
      tags: new FormControl()
  	});
  }

  ngOnInit() {
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

      });

    this.server.userPost('/tags/all', {})
      .subscribe(data => {
        switch (data.success) {
          case 1:
            this.tags = data.result;
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
    
    const shortName = this.websiteForm.value.shortName;
    const longName = this.websiteForm.value.longName;
    const domain = this.websiteForm.value.domain;
    const entityId = this.websiteForm.value.entity;
    const userId = this.websiteForm.value.user;
    const tags = this.websiteForm.value.tags;

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
}
