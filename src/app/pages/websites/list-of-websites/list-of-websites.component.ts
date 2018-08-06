import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import * as _ from 'lodash';

import { GetService } from '../../../services/get.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-list-of-websites',
  templateUrl: './list-of-websites.component.html',
  styleUrls: ['./list-of-websites.component.css']
})
export class ListOfWebsitesComponent implements OnInit {

  loading: boolean;
  error: boolean;

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

  constructor(
    private get: GetService,
    private message: MessageService
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.get.listOfWebsites()
      .subscribe(websites => {
        if (websites !== null) {
          this.dataSource = new MatTableDataSource(websites);
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
}
