import {Component, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {GetService} from '../../services/get.service';
import {DeleteService} from '../../services/delete.service';
import {AddCrawlerPagesDialogComponent} from '../../dialogs/add-crawler-pages-dialog/add-crawler-pages-dialog.component';
import {SelectionModel} from '@angular/cdk/collections';
import {CrawlerConfigDialogComponent} from '../../dialogs/crawler-config-dialog/crawler-config-dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list-of-crawls',
  templateUrl: './list-of-crawls.component.html',
  styleUrls: ['./list-of-crawls.component.css']
})
export class ListOfCrawlsComponent implements OnInit {

  displayedColumns = [
    'Domain',
    'Subdomain',
    'InitialDate',
    'Status',
    'Delete',
    'Result'
  ];

  user: string;

  loading: boolean;
  error: boolean;

  dataSource: any;
  selection: any;

  crawls: Array<any>;

  isListEmpty: boolean;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog,
              private translate: TranslateService,
              private deleteService: DeleteService,
              private get: GetService,
              private router: Router) {
    this.selection = new SelectionModel<any>(true, []);

  }

  ngOnInit(): void {
    this.getListOfCrawls();
  }

  private getListOfCrawls(): void {
    this.get.listOfCrawls()
      .subscribe(crawls => {
        if (crawls !== null) {
          this.isListEmpty = crawls.length === 0;
          this.crawls = crawls;
          this.dataSource = new MatTableDataSource(crawls);
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

  openAddCrawlerPagesDialog(e: Event, element: any) {
    e.preventDefault();
    const crawlDomainId = element.CrawlDomainId;
    const domainUri = element.DomainUri;
    const domainId = element.DomainId;
    this.dialog.open(AddCrawlerPagesDialogComponent, {
      width: '60vw',
      data: {
        crawlDomainId,
        domainUri,
        domainId
      }
    });
  }

  deleteCrawlerResult(e: Event, cdId: number) {
    e.preventDefault();
    this.deleteService.crawl(cdId)
      .subscribe(result => {
        if (result) {
          this.ngOnInit();
        } else {
          this.error = true;
        }
      });
  }

  substringSubdomain(subdomain: string): string {
    return subdomain.substring(subdomain.indexOf('/') + 1);
  }

  openCrawlerConfigDialog(): void {
    this.dialog.open(CrawlerConfigDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true
    });
  }

  goToDomainPage(): void {
    this.router.navigateByUrl('/console/domains');
  }

}
