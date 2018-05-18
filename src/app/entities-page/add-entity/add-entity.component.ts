import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormControlName, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { ServerService } from '../../services/server.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-add-entity',
  templateUrl: './add-entity.component.html',
  styleUrls: ['./add-entity.component.css']
})
export class AddEntityComponent implements OnInit {

  entityForm: FormGroup;
  websites: any;

  constructor(private server: ServerService, private message: MessageService) {
    this.entityForm = new FormGroup({
      shortName: new FormControl('', [
        Validators.required
      ]),
      longName: new FormControl('', [
        Validators.required
      ]),
      websites: new FormControl()
    });
  }

  ngOnInit() {
    this.server.userPost('/websites/withoutEntity', {})
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

  createEntity(e): void {
    e.preventDefault();
    
    const shortName = this.entityForm.value.shortName;
    const longName = this.entityForm.value.longName;
    const websites = this.entityForm.value.websites;

    const formData = {
      shortName,
      longName,
      websites
    };

    this.server.userPost('/entities/create', formData)
      .subscribe((data: any) => {
        console.log(data);
      }, (error: any) => {
        console.log(error);
      }, () => {

      });
  }
}
