import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'app-list-of-websites',
  templateUrl: './list-of-websites.component.html',
  styleUrls: ['./list-of-websites.component.css']
})
export class ListOfWebsitesComponent implements OnInit {

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

  constructor() { }

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
}
