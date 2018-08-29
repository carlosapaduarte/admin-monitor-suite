import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';

import { DeleteEvaluationDialogComponent } from '../../../dialogs/delete-evaluation-dialog/delete-evaluation-dialog.component';

@Component({
  selector: 'app-list-of-evaluations',
  templateUrl: './list-of-evaluations.component.html',
  styleUrls: ['./list-of-evaluations.component.css']
})
export class ListOfEvaluationsComponent implements OnInit {

  @Output('deleteEvaluation') deleteEvaluation = new EventEmitter<number>();
  @Input('evaluations') evaluations: Array<any>;

  displayedColumns = [
    'EvaluationId',
    'Score',
    'A',
    'AA',
    'AAA',
    'Evaluation_Date',
    'delete',
    'see'
  ];

  dataSource: any;
  selection: any;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.evaluations);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  openDeleteEvaluationDialog(evaluationId: number): void {
    let deleteDialog = this.dialog.open(DeleteEvaluationDialogComponent, {
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