import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {GetService} from '../../../services/get.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-list-of-websites-user',
  templateUrl: './list-of-websites-user.component.html',
  styleUrls: ['./list-of-websites-user.component.css']
})
export class ListOfWebsitesUserComponent implements OnInit {
  displayedColumns = [
    'Name',
    'Entity',
    'Creation_Date',
    'Import',
  ];

  // data source of domains
  dataSource: any;
  selection: any;

  loading: boolean;
  error: boolean;

  user: string;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private activatedRoute: ActivatedRoute,
    private get: GetService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.user = _.trim(params.user);
    });
    this.getListOfUserWebsites();
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  private getListOfUserWebsites(): void {
    this.get.listOfUserWebsites(this.user)
      .subscribe(tags => {
        if (tags !== null) {
          this.dataSource = new MatTableDataSource(tags);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        } else {
          this.error = true;
        }
        this.loading = false;
      });
  }
}

