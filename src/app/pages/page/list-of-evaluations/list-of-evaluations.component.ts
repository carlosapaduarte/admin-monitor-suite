import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';

import { DeleteEvaluationDialogComponent } from '../../../dialogs/delete-evaluation-dialog/delete-evaluation-dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list-of-evaluations',
  templateUrl: './list-of-evaluations.component.html',
  styleUrls: ['./list-of-evaluations.component.css']
})
export class ListOfEvaluationsComponent implements OnInit {

  @Output('deleteEvaluation') deleteEvaluation = new EventEmitter<number>();
  @Input('evaluations') evaluations: Array<any>;

  displayedColumns = [
    //'EvaluationId',
    'Score',
    'A',
    'AA',
    'AAA',
    'Evaluation_Date',
    //'delete',
    'see'
  ];

  dataSource: any;
  selection: any;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private dialog: MatDialog, private translate: TranslateService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.evaluations);
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

  openDeleteEvaluationDialog(evaluationId: number): void {
    const deleteDialog = this.dialog.open(DeleteEvaluationDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true
    });

    deleteDialog.afterClosed()
      .subscribe(result => {
        if (result) {
          this.deleteEvaluation.next(evaluationId);
        }
      });
  }
}
