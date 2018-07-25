import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import * as _ from 'lodash';

import { ServerService } from '../../../services/server.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-list-of-websites',
  templateUrl: './list-of-websites.component.html',
  styleUrls: ['./list-of-websites.component.css']
})
export class ListOfWebsitesComponent implements OnInit {

  loading: boolean;

  displayedColumns = [
    'WebsiteId', 
    'Name',
    'Entity',
    'User', 
    'Current_Domain',
    'Pages',
    'Tags', 
    'Creation_Date',  
    'edit'
  ];

  // data source of domains
  dataSource: any;
  selection: any;

  // table filter
  @ViewChild('input') input: ElementRef;

  // column sorter
  @ViewChild(MatSort) sort: MatSort;

  // table paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private server: ServerService, private message: MessageService) {
    this.loading = true;

    this.server.userPost('/websites/allInfo', {})
      .subscribe((data) => {
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
}
