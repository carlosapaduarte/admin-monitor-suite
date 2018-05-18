import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { ServerService } from '../../services/server.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-add-domain',
  templateUrl: './add-domain.component.html',
  styleUrls: ['./add-domain.component.css']
})
export class AddDomainComponent implements OnInit {

  domainForm: FormGroup;
  websites: any;

  constructor(private server: ServerService, private message: MessageService) {
    this.domainForm = new FormGroup({
      websiteId: new FormControl('', [
        Validators.required
      ]),
      url: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngOnInit() {
    this.server.userPost('/websites/all', {})
      .subscribe(data => {
        console.log(data);
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
  }

  createDomain(e): void {
    e.preventDefault();
    
    const websiteId = this.domainForm.value.websiteId;
    const url = this.domainForm.value.url;
    
    const formData = {
      websiteId,
      url
    };

    this.server.userPost('/domains/create', formData)
      .subscribe((data: any) => {
        console.log(data);
      }, (error: any) => {
        console.log(error);
      }, () => {

      });
  }
}
