import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import * as _ from 'lodash';

import { GetService } from '../../../services/get.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-list-of-tags',
  templateUrl: './list-of-tags.component.html',
  styleUrls: ['./list-of-tags.component.css']
})
export class ListOfTagsComponent implements OnInit {

  loading: boolean;
  error: boolean;

  displayedColumns = [
    'TagId',
    'Name',
    'Show_in_Observatorio',
    'User',
    'Creation_Date',
    'Websites',
    'edit',
    'see'
  ];

  dataSource: any;
  selection: any;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private get: GetService,
    private message: MessageService
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.get.listOfTags()
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

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }
}
