import { Component, OnInit, AfterViewInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';

import { DeletePageDialogComponent } from '../../../dialogs/delete-page-dialog/delete-page-dialog.component';

import { UpdateService } from '../../../services/update.service';
import { MessageService } from '../../../services/message.service';
import {OpenDataService} from '../../../services/open-data.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {atLeastOne, UriValidation} from '../../../dialogs/add-page-dialog/add-page-dialog.component';

@Component({
  selector: 'app-list-of-pages',
  templateUrl: './list-of-pages.component.html',
  styleUrls: ['./list-of-pages.component.css']
})
export class ListOfPagesComponent implements OnInit, AfterViewInit {

  @Output('deletePage') deletePage = new EventEmitter<number>();
  @Input('pages') pages: Array<any>;

  displayedColumns = [
    // 'PageId',
    'Uri',
    'Score',
    'Evaluation_Date',
    'Show_In',
    'delete',
    'see'
  ];

  dataSource: any;
  selection: any;

  error: boolean;
  loadingResponse: boolean;
  pagesForm: FormGroup;
  fileErrorMessage: string;
  jsonFromFile: string;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private update: UpdateService,
    private odf: OpenDataService,
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

  sendFile() {
    const fileToRead = (<HTMLInputElement>document.getElementById('odfFile')).files[0];

    if (fileToRead === null) {
      this.pagesForm.controls.file.reset();
      return;
    }

    console.log(fileToRead.type);
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
      console.log(this.jsonFromFile);
    };
  }

}
