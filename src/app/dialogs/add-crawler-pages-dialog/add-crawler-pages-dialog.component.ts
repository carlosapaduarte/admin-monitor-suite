import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import * as _ from 'lodash';
import {CrawlerDialogComponent} from '../crawler-dialog/crawler-dialog.component';

@Component({
  selector: 'app-add-crawler-pages-dialog',
  templateUrl: './add-crawler-pages-dialog.component.html',
  styleUrls: ['./add-crawler-pages-dialog.component.css']
})
export class AddCrawlerPagesDialogComponent implements OnInit {

  displayedColumns = [
    'Uri',
    'select'
  ];

  pages: Array<any>;
  dataSource: MatTableDataSource<any>;
  selection: any;

  domain: string;
  domainId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddCrawlerPagesDialogComponent>,
    private dialog: MatDialog
  ) {
    this.domain = this.data.domain;
    this.domainId = this.data.domainId;
    this.dataSource = new MatTableDataSource(_.map(this.data.uris, u => ( { Uri: u } )));
    this.selection = new SelectionModel<any>(true, []);
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  choosePages(e): void {
    e.preventDefault();

    this.dialogRef.close({
      cancel: false,
      uris: JSON.stringify(_.map(this.selection.selected, 'Uri'))
    });
    this.openCrawlerDialog(e);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  openCrawlerDialog(e){
    e.preventDefault();

    const url = this.domain;
    const domainId = this.domainId;
    this.dialog.open(CrawlerDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true,
      data: {url, domainId}
    });
  }
}
