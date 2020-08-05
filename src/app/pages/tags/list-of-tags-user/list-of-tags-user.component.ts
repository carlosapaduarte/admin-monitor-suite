import {Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {GetService} from '../../../services/get.service';

import * as _ from 'lodash';
import {ActivatedRoute} from '@angular/router';
import {ImportTagDialogComponent} from '../../../dialogs/import-tag-dialog/import-tag-dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list-of-tags-user',
  templateUrl: './list-of-tags-user.component.html',
  styleUrls: ['./list-of-tags-user.component.css']
})
export class ListOfTagsUserComponent implements OnInit {

  loading: boolean;
  error: boolean;

  user: string;

  displayedColumns = [
    'Name',
    //'Show_in_Observatorio',
    'Creation_Date',
    'Websites',
    'Import'
  ];

  tags: Array<any>;
  dataSource: any;
  selection: any;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private get: GetService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private cd: ChangeDetectorRef
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.user = _.trim(params.user);
    });
    this.getListOfUserTags();
  }

  private getListOfUserTags(): void {
    this.get.listOfUserTags(this.user)
      .subscribe(tags => {
        if (tags !== null) {
          this.tags = tags;
          this.dataSource = new MatTableDataSource(this.tags);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          const paginatorIntl = new MatPaginatorIntl();
          paginatorIntl.itemsPerPageLabel = this.translate.instant('ITEMS_PER_PAGE_LABEL');
          paginatorIntl.nextPageLabel = this.translate.instant('NEXT_PAGE_LABEL');
          paginatorIntl.previousPageLabel = this.translate.instant('PREVIOUS_PAGE_LABEL');
          paginatorIntl.firstPageLabel = this.translate.instant('FIRST_PAGE_LABEL');
          paginatorIntl.lastPageLabel = this.translate.instant('LAST_PAGE_LABEL');
          paginatorIntl.getRangeLabel = this.getRangeLabel.bind(this);

          this.dataSource.paginator._intl = paginatorIntl;
        } else {
          this.error = true;
        }

        this.loading = false;
      });
  }

  private getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
        return this.translate.instant('RANGE_PAGE_LABEL_1', { length });
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return this.translate.instant('RANGE_PAGE_LABEL_2', { startIndex: startIndex + 1, endIndex, length });
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  openImportTagDialog(tagName: string, tagId: string): void {
    const importTagDialog = this.dialog.open(ImportTagDialogComponent, {
      width: '40vw',
      data: {
        tag: tagName,
        tagId: tagId,
      }
    });
    importTagDialog.afterClosed().subscribe(result => {
      if (result) {
        const tag = _.filter(this.tags);
        tag[0].imported = true;
        this.loading = true;
        this.cd.detectChanges();
        this.getListOfUserTags();
        //window.location.reload();
      }
    });
  }

}
