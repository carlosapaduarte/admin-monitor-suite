import {Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {GetService} from '../../../services/get.service';
import {MessageService} from '../../../services/message.service';
import {EditTagDialogComponent} from '../../../dialogs/edit-tag-dialog/edit-tag-dialog.component';

import * as _ from 'lodash';
import {ActivatedRoute} from '@angular/router';
import {ImportWebsiteDialogComponent} from '../../../dialogs/import-website-dialog/import-website-dialog.component';
import {ImportTagDialogComponent} from '../../../dialogs/import-tag-dialog/import-tag-dialog.component';

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
        } else {
          this.error = true;
        }

        this.loading = false;
      });
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
