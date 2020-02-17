import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';

import { GetService } from '../../../services/get.service';

import { EditEntityDialogComponent } from '../../../dialogs/edit-entity-dialog/edit-entity-dialog.component';
import { ChoosePagesToReEvaluateDialogComponent } from './../../../dialogs/choose-pages-to-re-evaluate-dialog/choose-pages-to-re-evaluate-dialog.component';

@Component({
  selector: 'app-list-of-entities',
  templateUrl: './list-of-entities.component.html',
  styleUrls: ['./list-of-entities.component.css']
})
export class ListOfEntitiesComponent implements OnInit {

  loading: boolean;
  error: boolean;

  displayedColumns = [
    //'EntityId',
    'Short_Name',
    'Long_Name',
    'Creation_Date',
    'Websites',
    're-evaluate',
    'edit',
    //'see'
  ];

  dataSource: any;
  selection: any;

  @ViewChild('input', { static: false }) input: ElementRef;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private get: GetService,
    private cd: ChangeDetectorRef
  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.getListOfEntities();
  }

  private getListOfEntities(): void {
    this.get.listOfEntities()
      .subscribe(entities => {
        if (entities !== null) {
          this.dataSource = new MatTableDataSource(entities);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        } else {
          this.error = true;
        }

        this.loading = false;
        this.cd.detectChanges();
      });
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  reEvaluateEntityWebsites(entityId: number): void {
    this.dialog.open(ChoosePagesToReEvaluateDialogComponent, {
      width: '40vw',
      data: {
        info: entityId,
        dialog: 'entity'
      }
    });
  }

  edit(id: number): void {
    const editDialog = this.dialog.open(EditEntityDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true,
      data: { id }
    });

    editDialog.afterClosed()
      .subscribe(result => {
        if (result) {
          this.loading = true;
          this.getListOfEntities();
        }
      });
  }
}
