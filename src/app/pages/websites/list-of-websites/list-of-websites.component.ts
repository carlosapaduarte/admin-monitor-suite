import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import { Overlay } from '@angular/cdk/overlay';
import * as _ from 'lodash';

import { EditWebsiteDialogComponent } from '../../../dialogs/edit-website-dialog/edit-website-dialog.component';

@Component({
  selector: 'app-list-of-websites',
  templateUrl: './list-of-websites.component.html',
  styleUrls: ['./list-of-websites.component.css']
})
export class ListOfWebsitesComponent implements OnInit {

  @Output('refreshWebsites') refreshWebsites = new EventEmitter<boolean>();
  @Input('websites') websites: any;

  displayedColumns = [
    'WebsiteId',
    'Name',
    'Entity',
    'User',
    'Creation_Date',
    'edit',
    'see'
  ];

  // data source of domains
  dataSource: any;
  selection: any;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private overlay: Overlay
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

  edit(id: number): void {
    const editDialog = this.dialog.open(EditWebsiteDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data: { id }
    });

    editDialog.afterClosed()
      .subscribe(result => {
        if (result) {
          this.refreshWebsites.next(true);
        }
      });
  }
}
