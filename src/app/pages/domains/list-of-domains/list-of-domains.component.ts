import {Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';

import { EditDomainDialogComponent } from './../../../dialogs/edit-domain-dialog/edit-domain-dialog.component';
import {DeleteDomainDialogComponent} from '../../../dialogs/delete-domain-dialog/delete-domain-dialog.component';
import {CrawlerDialogComponent} from '../../../dialogs/crawler-dialog/crawler-dialog.component';
import {ActivatedRoute} from '@angular/router';
import {GetService} from '../../../services/get.service';

import { ChoosePagesToReEvaluateDialogComponent } from './../../../dialogs/choose-pages-to-re-evaluate-dialog/choose-pages-to-re-evaluate-dialog.component';

@Component({
  selector: 'app-list-of-domains',
  templateUrl: './list-of-domains.component.html',
  styleUrls: ['./list-of-domains.component.css']
})
export class ListOfDomainsComponent implements OnInit {

  @Output('refreshDomains') refreshDomains = new EventEmitter<boolean>();
  @Input('domains') domains: Array<any>;

  displayedColumns = [
    //'DomainId',
    'Url',
    'Active',
    'Pages',
    'Start_Date',
    'End_Date',
    //'delete',
    //'see',
    're-evaluate',
    'Edit',
    'see'
  ];

  user: string;

  dataSource: any;
  selection: any;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.user = _.trim(params.user);

      if (this.user !== '') {
        this.displayedColumns = [
          'Url',
          'Active',
          'Pages',
          'Start_Date',
          'End_Date',
          'delete'
        ];
      }
    });
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.domains);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  reEvaluateWebsitePages(domainId: number): void {
    this.dialog.open(ChoosePagesToReEvaluateDialogComponent, {
      width: '40vw',
      data: {
        info: domainId,
        dialog: 'website'
      }
    });
  }

  openEditDomainDialog(domainId: number, url: string): void {
    const editDialog = this.dialog.open(EditDomainDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true,
      data: {
        domainId,
        url
      }
    });

    editDialog.afterClosed()
      .subscribe(result => {
        if (result) {
          this.refreshDomains.next(true);
        }
      });
  }

  openCrawlerDialog(e, url, domainId): void {
    e.preventDefault();

    this.dialog.open(CrawlerDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true,
      data: {url, domainId}
    });
  }
}
