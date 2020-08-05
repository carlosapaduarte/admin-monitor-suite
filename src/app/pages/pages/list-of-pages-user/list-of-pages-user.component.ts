import { Component, OnInit, AfterViewInit, Input, Output, ViewChild, ElementRef, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';

import { UpdateService } from '../../../services/update.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list-of-pages-user',
  templateUrl: './list-of-pages-user.component.html',
  styleUrls: ['./list-of-pages-user.component.css']
})
export class ListOfPagesUserComponent implements OnInit, AfterViewInit {

  @Output('deletePage') deletePage = new EventEmitter<number>();
  @Input('pages') pages: Array<any>;

  displayedColumns = [
    'Uri',
    'Score',
    'Evaluation_Date',
    'Import',
  ];

  dataSource: any;
  selection: any;

  user: string;
  tag: string;
  website: string;

  error: boolean;
  pagesForm: FormGroup;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private activatedRoute: ActivatedRoute,
    private update: UpdateService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private cd: ChangeDetectorRef
  ) {
    this.pagesForm = this.formBuilder.group({
      file: new FormControl()});
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.pages);
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

    this.activatedRoute.params.subscribe(params => {
      this.user = _.trim(params.user);
      this.tag = params.tag;
      this.website = params.website;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'Import':
          //TODO fix this
          return _.includes(['both'], item['Import']);
        default:
          return item[property];
      }
    };
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

  setPageinAMS(pageId: string): void {
    this.update.importPage({ pageId: pageId, user: this.user, tag: this.tag, website: this.website})
      .subscribe(result => {
        if (result) {
          const page = _.filter(this.pages, ['PageId', pageId]);
          page[0].Show_In = '1' + page[0].Show_In[1] + page[0].Show_In[2];
          this.cd.detectChanges();
        }
      });
  }

  isAdminPage(flags: string): boolean {
    const yes = new RegExp('[1][0-1][0-1]');
    return yes.test(flags);
  }

}
