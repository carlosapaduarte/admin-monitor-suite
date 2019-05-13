import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import * as _ from 'lodash';

import { GetService } from '../../services/get.service';
import { DeleteService } from '../../services/delete.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-delete-website-pages-dialog',
  templateUrl: './delete-website-pages-dialog.component.html',
  styleUrls: ['./delete-website-pages-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteWebsitePagesDialogComponent implements OnInit {

  loading: boolean;
  error: boolean;

  displayedColumns = [
    'Uri',
    'select'
  ];

  pages: Array<any>;
  dataSource: MatTableDataSource<any>;
  selection: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DeleteWebsitePagesDialogComponent>,
    private get: GetService,
    private remove: DeleteService,
    private message: MessageService,
    private cd: ChangeDetectorRef
  ) {
    this.loading = true;
    this.error = false;

    this.selection = new SelectionModel<any>(true, []);
  }

  ngOnInit(): void {
    this.get.listOfWebsitePages(this.data.id)
      .subscribe(pages => {
        if (pages) {
          this.pages = pages;
          this.dataSource = new MatTableDataSource<any>(pages);
        } else {
          this.error = true;
        }

        this.loading = false;
        this.cd.detectChanges();
      });
  }

  deleteWebsitePages(e): void {
    e.preventDefault();

    const pages = _.map(this.selection.selected, 'PageId');

    this.remove.pages({pages})
      .subscribe(success => {
        if (success) {
          this.message.show('WEBSITES_PAGE.UPDATE.delete_pages.success');
          this.dialogRef.close();
        }
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
