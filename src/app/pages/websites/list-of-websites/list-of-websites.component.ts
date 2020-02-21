import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import * as _ from 'lodash';

import { MessageService } from './../../../services/message.service';
import { DigitalStampService } from './../../../services/digital-stamp.service';

import { EditWebsiteDialogComponent } from '../../../dialogs/edit-website-dialog/edit-website-dialog.component';
import { ChoosePagesToReEvaluateDialogComponent } from '../../../dialogs/choose-pages-to-re-evaluate-dialog/choose-pages-to-re-evaluate-dialog.component';

@Component({
  selector: 'app-list-of-websites',
  templateUrl: './list-of-websites.component.html',
  styleUrls: ['./list-of-websites.component.css']
})
export class ListOfWebsitesComponent implements OnInit {

  @Output('refreshWebsites') refreshWebsites = new EventEmitter<boolean>();
  @Input('websites') websites: any;

  displayedColumns = [
    //'WebsiteId',
    'Name',
    'Entity',
    //'User',
    'Creation_Date',
    're-evaluate',
    'edit',
    'stamp',
    'see'
  ];

  // data source of domains
  dataSource: any;
  selection: any;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private overlay: Overlay,
    private message: MessageService,
    private digitalStamp: DigitalStampService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.websites);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  reEvaluateWebsitePages(domainId: number): void {
    this.dialog.open(ChoosePagesToReEvaluateDialogComponent, {
      width: '40vw',
      data: {
        info: domainId,
        dialog: 'website'
      }
    });
  }

  edit(id: number, userType: string): void {
    const editDialog = this.dialog.open(EditWebsiteDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data: { id, userType }
    });

    editDialog.afterClosed()
      .subscribe(result => {
        if (result) {
          this.refreshWebsites.next(true);
        }
      });
  }

  generateDigitalStamps(): void {
    this.digitalStamp.generateForAll()
      .subscribe(errors => {
        if (_.size(errors) === 0) {
          this.message.show('DIGITAL_STAMP.messages.generate_all_success');
        }
      });
  }

  generateWebsiteDigitalStamp(websiteId: number, name: string): void {
    this.digitalStamp.generateForWebsite({websiteId, name})
      .subscribe(success => {
        if (success) {
          this.message.show('DIGITAL_STAMP.messages.generate_website_success');
        }
      });
  }
}
