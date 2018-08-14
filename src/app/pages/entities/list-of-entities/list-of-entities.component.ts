import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';

import { GetService } from '../../../services/get.service';
import { MessageService } from '../../../services/message.service';

import { EditEntityDialogComponent } from '../../../dialogs/edit-entity-dialog/edit-entity-dialog.component';

@Component({
  selector: 'app-list-of-entities',
  templateUrl: './list-of-entities.component.html',
  styleUrls: ['./list-of-entities.component.css']
})
export class ListOfEntitiesComponent implements OnInit {

  loading: boolean;
  error: boolean;

  displayedColumns = [
    'EntityId',
    'Short_Name',
    'Long_Name',
    'Creation_Date',
    'Websites',
    'edit',
    'see'
  ];

  dataSource: any;
  selection: any;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private get: GetService,
    private message: MessageService
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.get.listOfEntities()
      .subscribe(entities => {
        if (entities !== null) {
          this.dataSource = new MatTableDataSource(entities);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        } else {
          this.error = true;
        }

        this.loading = false;
      });
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  edit(id: number): void {
    this.dialog.open(EditEntityDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true,
      data: { id }
    });
  }
}
