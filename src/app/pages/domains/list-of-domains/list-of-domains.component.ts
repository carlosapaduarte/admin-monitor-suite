import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'app-list-of-domains',
  templateUrl: './list-of-domains.component.html',
  styleUrls: ['./list-of-domains.component.css']
})
export class ListOfDomainsComponent implements OnInit {

  @Input('domains') domains: Array<any>;

  displayedColumns = [
    'DomainId',
    'Url',
    'Active',
    'User',
    'Pages',
    'Start_Date', 
    'End_Date', 
    'edit',
    'see'
  ];

  dataSource: any;
  selection: any;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.domains);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }
}
