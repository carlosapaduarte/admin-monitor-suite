import { Component, OnInit, AfterViewInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';

import { DeletePageDialogComponent } from '../../../dialogs/delete-page-dialog/delete-page-dialog.component';

import { UpdateService } from '../../../services/update.service';
import {OpenDataService} from '../../../services/open-data.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

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

  user: string;

  error: boolean;
  pagesForm: FormGroup;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private activatedRoute: ActivatedRoute,
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
    this.activatedRoute.params.subscribe(params => {
      this.user = _.trim(params.user);
    });
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

  setPageinAMS(pageId: string): void {
    this.update.importPage({ pageId: pageId, user: this.user}).subscribe();
    //TODO deixar isto assim?
    window.location.reload();
  }

  isAdminPage(flags: string): boolean {
    const yes = new RegExp('[1][0-1][0-1]');
    return yes.test(flags);
  }

}
