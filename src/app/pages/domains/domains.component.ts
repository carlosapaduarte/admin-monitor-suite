import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { GetService } from '../../services/get.service';
import { DeleteService } from '../../services/delete.service';
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
    private deleteService: DeleteService,
    private message: MessageService,
    private cd: ChangeDetectorRef
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.getListOfDomains();
  }

  private getListOfDomains(): void {
    this.get.listOfDomains()
      .subscribe(domains => {
        if (domains !== null) {
          this.domains = domains;
        } else {
          this.error = true;
        }

        this.loading = false;
        this.cd.detectChanges();
      });
  }

  deleteDomain(domain): void {
    this.deleteService.domain({domainId: domain})
      .subscribe(success => {
        if (success !== null) {
          this.loading = true;
          this.getListOfDomains();
          this.message.show('DOMAINS_PAGE.DELETE.messages.success');
        }
      });
  }
}
