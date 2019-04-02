import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';

import { GetService } from '../../../services/get.service';
import { MessageService } from '../../../services/message.service';

import { EditUserDialogComponent } from '../../../dialogs/edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-list-of-users',
  templateUrl: './list-of-users.component.html',
  styleUrls: ['./list-of-users.component.css']
})
export class ListOfUsersComponent implements OnInit {

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  loading: boolean;
  error: boolean;

  displayedColumns = [
    //'UserId',
    'Username',
    'Type',
    'Websites',
    'Register_Date',
    'Last_Login',
    'edit',
    //'see'
  ];

  // data source of domains
  dataSource: any;
  selection: any;

  constructor(
    private dialog: MatDialog,
    private get: GetService,
    private cd: ChangeDetectorRef
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.getListOfUsers();
  }

  private getListOfUsers(): void {
    this.get.listOfUsers()
      .subscribe(users => {
        if (users !== null) {
          this.dataSource = new MatTableDataSource(users);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        } else {
          this.error = true;
        }

        this.loading = false;
        this.cd.detectChanges();
      });
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  edit(id: number): void {
    const editDialog = this.dialog.open(EditUserDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true,
      data: { id }
    });

    editDialog.afterClosed()
      .subscribe(result => {
        if (result) {
          this.loading = true;
          this.getListOfUsers();
        }
      });
  }
}
