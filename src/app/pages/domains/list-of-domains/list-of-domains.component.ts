import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import * as _ from 'lodash';

import { GetService } from '../../../services/get.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-list-of-domains',
  templateUrl: './list-of-domains.component.html',
  styleUrls: ['./list-of-domains.component.css']
})
export class ListOfDomainsComponent implements OnInit {

  loading: boolean;
  error: boolean;

  displayedColumns = [
    'DomainId',
    'Url',
    'Website',  
    'Active', 
    'Pages',
    'Tags',
    'Start_Date', 
    'End_Date', 
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
    this.get.listOfDomains()
      .subscribe(domains => {
        if (domains !== null) {
          this.dataSource = new MatTableDataSource(domains);
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
