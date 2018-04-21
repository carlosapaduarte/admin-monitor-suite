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

  constructor() {
  	this.websiteForm = new FormGroup({
  		shortName: new FormControl('', [
  			Validators.required
  		]),
  		longName: new FormControl('', [
  			Validators.required
  		]),
  		entity: new FormControl(),
  		user: new FormControl()
  	});
  }

  ngOnInit() {
  }

}
