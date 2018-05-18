import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { ServerService } from '../../services/server.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.css']
})
export class AddPageComponent implements OnInit {

  pageForm: FormGroup;
  domains: any;

  constructor(private server: ServerService, private message: MessageService) {
    this.pageForm = new FormGroup({
      domainId: new FormControl('', [
        Validators.required
      ]),
      uri: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngOnInit() {
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

      });
  }

  createPage(e): void {
    e.preventDefault();
    
    const domainId = this.pageForm.value.domainId;
    const uri = this.pageForm.value.uri;
    
    const formData = {
      domainId,
      uri
    };

    this.server.userPost('/pages/create', formData)
      .subscribe((data: any) => {
        console.log(data);
      }, (error: any) => {
        console.log(error);
      }, () => {

      });
  }
}
