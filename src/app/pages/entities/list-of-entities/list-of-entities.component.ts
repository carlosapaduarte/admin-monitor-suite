import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';

import { ServerService } from '../../../services/server.service';
import { MessageService } from '../../../services/message.service';

import { EditEntityDialogComponent } from '../../../dialogs/edit-entity-dialog/edit-entity-dialog.component';

@Component({
  selector: 'app-list-of-entities',
  templateUrl: './list-of-entities.component.html',
  styleUrls: ['./list-of-entities.component.css']
})
export class ListOfEntitiesComponent implements OnInit {

  loading: boolean;

  displayedColumns = ['EntityId', 'Short_Name', 'Long_Name', 'Creation_Date', 'Websites', 'Tags', 'edit'];

  // data source of domains
  dataSource: any;
  selection: any;

  // table filter
  @ViewChild('input') input: ElementRef;

  // column sorter
  @ViewChild(MatSort) sort: MatSort;

  // table paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog, private server: ServerService, 
    private message: MessageService) {
    
    this.loading = true;

    this.server.userPost('/entities/allInfo', {})
      .subscribe((data) => {
        console.log(data);
        switch (data['success']) {
          case 1:
            this.dataSource = new MatTableDataSource(data['result']);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            break;
        }
      }, (error) => {
        this.message.show('MISC.messages.data_error');
        console.log(error);
      }, () => {
        this.loading = false;
      });
  }

  ngOnInit(): void {
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
