import { Component, OnInit, AfterViewInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';

import { DeletePageDialogComponent } from '../../../dialogs/delete-page-dialog/delete-page-dialog.component';

import { UpdateService } from '../../../services/update.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-list-of-pages',
  templateUrl: './list-of-pages.component.html',
  styleUrls: ['./list-of-pages.component.css']
})
export class ListOfPagesComponent implements OnInit, AfterViewInit {

  @Output('deletePage') deletePage = new EventEmitter<number>();
  @Input('pages') pages: Array<any>;

  displayedColumns = [
    'PageId',
    'Uri',
    'Score',
    'Evaluation_Date',
    'Show_In',
    'delete',
    'see'
  ];

  dataSource: any;
  selection: any;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private update: UpdateService,
    private message: MessageService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.pages);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'Show_In':
          return _.includes(['observatorio', 'both'], item['Show_In']);

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

  setPageInObservatorio(checkbox: any, page: any): void {
    this.update.page({ pageId: page.PageId, checked: checkbox.checked }).subscribe();
  }

  openDeletePageDialog(pageId: number): void {
    const deleteDialog = this.dialog.open(DeletePageDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true
    });

    deleteDialog.afterClosed()
      .subscribe(result => {
        if (result) {
          this.deletePage.next(pageId);
        }
      });
  }
}
