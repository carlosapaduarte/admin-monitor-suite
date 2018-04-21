import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import * as _ from 'lodash';

import { ServerService } from '../../services/server.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-list-of-users',
  templateUrl: './list-of-users.component.html',
  styleUrls: ['./list-of-users.component.css']
})
export class ListOfUsersComponent implements OnInit {

  loading: boolean;

  displayedColumns = ['UserId', 'Email', 'Type', 'websites', 'Register_Date', 'Last_Login', 'edit'];

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

    const formData = new FormData();
    formData.append('service', 'admin-list-of-users');

    this.server.userPost(formData)
      .subscribe((data) => {
        console.log(data);
        this.dataSource = new MatTableDataSource(data['results']);
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
