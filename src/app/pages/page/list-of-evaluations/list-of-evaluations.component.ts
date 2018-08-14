import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'app-list-of-evaluations',
  templateUrl: './list-of-evaluations.component.html',
  styleUrls: ['./list-of-evaluations.component.css']
})
export class ListOfEvaluationsComponent implements OnInit {

  @Input('evaluations') evaluations: Array<any>;

  displayedColumns = [
    'EvaluationId', 
    'Score', 
    'A', 
    'AA', 
    'AAA',
    'Evaluation_Date', 
    'see'
  ];

  dataSource: any;
  selection: any;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.evaluations);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }
}
