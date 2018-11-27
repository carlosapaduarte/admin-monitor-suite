import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import * as _ from 'lodash';

@Component({
  selector: 'app-choose-observatory-pages-dialog',
  templateUrl: './choose-observatory-pages-dialog.component.html',
  styleUrls: ['./choose-observatory-pages-dialog.component.css']
})
export class ChooseObservatoryPagesDialogComponent implements OnInit {

  displayedColumns = [
    'Uri',
    'select'
  ];

  pages: Array<any>;
  dataSource: MatTableDataSource<any>;
  selection: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ChooseObservatoryPagesDialogComponent>
  ) {
    this.dataSource = new MatTableDataSource(_.map(this.data.uris, u => ( { Uri: u } )));
    this.selection = new SelectionModel<any>(true, []);
  }

  ngOnInit(): void {
  }

  choosePages(e): void {
    e.preventDefault();

    this.dialogRef.close({
      cancel: false,
      uris: JSON.stringify(_.map(this.selection.selected, 'Uri'))
    });
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
}
