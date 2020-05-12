import { Component, OnInit, AfterViewInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';

import { DeletePageDialogComponent } from '../../../dialogs/delete-page-dialog/delete-page-dialog.component';
import { EvaluationErrorDialogComponent } from '../../../dialogs/evaluation-error-dialog/evaluation-error-dialog.component';

import { UpdateService } from '../../../services/update.service';
import { OpenDataService } from '../../../services/open-data.service';

@Component({
  selector: 'app-list-of-pages',
  templateUrl: './list-of-pages.component.html',
  styleUrls: ['./list-of-pages.component.css']
})
export class ListOfPagesComponent implements OnInit, AfterViewInit {

  @Output('deletePages') deletePages = new EventEmitter<Array<number>>();
  @Input('pages') pages: Array<any>;

  displayedColumns = [
    // 'PageId',
    'Uri',
    'Score',
    'Evaluation_Date',
    'State',
    'Show_In',
    'delete',
    //'see'
  ];

  dataSource: any;
  selection: SelectionModel<any>;

  error: boolean;
  loadingResponse: boolean;
  pagesForm: FormGroup;
  fileErrorMessage: string;
  jsonFromFile: string;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private update: UpdateService,
    private odf: OpenDataService,
    private formBuilder: FormBuilder
  ) {
    this.pagesForm = this.formBuilder.group({
        file: new FormControl()});
    this.selection = new SelectionModel<any>(true, []);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.pages);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
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

  setPageInObservatory(checkbox: any, page: any): void {
    this.update.page({ pageId: page.PageId, checked: checkbox.checked })
    .subscribe(result => {
      if (!result) {
        checkbox.source.checked = !checkbox.checked;
      }
    });
  }

  openDeletePageDialog(): void {
    const deleteDialog = this.dialog.open(DeletePageDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true
    });

    deleteDialog.afterClosed()
      .subscribe(result => {
        if (result) {
          this.deletePages.next(_.map(this.selection.selected, 'PageId'));
        }
      });
  }

  openErrorDialog(evaluationListId: number): void {
    this.dialog.open(EvaluationErrorDialogComponent, {
      width: '40vw',
      data: {
        evaluationListId
      }
    });
  }

  sendFile() {
    const fileToRead = (<HTMLInputElement>document.getElementById('odfFile')).files[0];

    if (fileToRead === null) {
      this.pagesForm.controls.file.reset();
      return;
    }

    switch (fileToRead.type) {
      case ('application/json'):
        this.parseJSON(fileToRead);
        break;
      default:
        this.jsonFromFile = '';
        this.fileErrorMessage = 'invalidType';
        break;
    }

    this.loadingResponse = true;
    this.odf.sendOpenDataFile(this.jsonFromFile)
      .subscribe(response => {
        if (response) {
          // TODO O QUE FAZER COM BOOLEAN RECEBIDO
        } else {
          this.error = true;
        }
        this.loadingResponse = false;
      });
  }

  parseJSON(file: File): void {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      this.jsonFromFile = reader.result.toString();
    };
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
        this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
