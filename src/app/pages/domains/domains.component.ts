import { Component, OnInit } from '@angular/core';

import { GetService } from '../../services/get.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.css']
})
export class DomainsComponent implements OnInit {

  loading: boolean;
  error: boolean;

  domains: Array<any>;

  constructor(
    private get: GetService,
    private message: MessageService
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.get.listOfDomains()
      .subscribe(domains => {
        if (domains !== null) {
          this.domains = domains;
        } else {
          this.error = true;
        }

        this.loading = false;
      });
  }
}
