import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { GetService } from '../../services/get.service';
import { DeleteService } from '../../services/delete.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  loading: boolean;
  error: boolean;

  pages: Array<any>;

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
    this.getListOfPages();
  }

  deletePages(pages): void {
    this.deleteService.pages({pages})
      .subscribe(success => {
        if (success !== null) {
          this.loading = true;
          this.cd.detectChanges();

          this.getListOfPages();
          this.message.show('PAGES_PAGE.DELETE.messages.success');
        }
      });
  }

  private getListOfPages(): void {
    this.get.listOfPages()
      .subscribe(pages => {
        if (pages !== null) {
          this.pages = pages;
        } else {
          this.error = true;
        }

        this.loading = false;
        this.cd.detectChanges();
      });
  }
}
