import { Component, OnInit, AfterViewInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';

import { DeletePageDialogComponent } from '../../../dialogs/delete-page-dialog/delete-page-dialog.component';

import { UpdateService } from '../../../services/update.service';
import {OpenDataService} from '../../../services/open-data.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-list-of-pages-user',
  templateUrl: './list-of-pages-user.component.html',
  styleUrls: ['./list-of-pages-user.component.css']
})
export class ListOfPagesUserComponent implements OnInit, AfterViewInit {

  @Output('deletePage') deletePage = new EventEmitter<number>();
  @Input('pages') pages: Array<any>;

  displayedColumns = [
    'Uri',
    'Score',
    'Evaluation_Date',
    'Import',
  ];

  dataSource: any;
  selection: any;

  error: boolean;
  pagesForm: FormGroup;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private update: UpdateService,
    private formBuilder: FormBuilder,
  ) {
    this.pagesForm = this.formBuilder.group({
      file: new FormControl()});
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.pages);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'Import':
          //TODO fix this
          return _.includes(['both'], item['Import']);

        default:
          return item[property];
      }
    };
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  setPageinAMS(checkbox: any, page: any): void {
    this.update.importPage({ pageId: page.PageId, checked: checkbox.checked }).subscribe();
  }

  isAdminPage(flags: string): boolean {
    const yes = new RegExp('[1][0-1][0-1]');
    return yes.test(flags);
  }

}
