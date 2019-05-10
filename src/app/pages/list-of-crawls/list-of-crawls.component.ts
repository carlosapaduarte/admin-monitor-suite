import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';
import {GetService} from '../../services/get.service';
import {AddCrawlerPagesDialogComponent} from '../../dialogs/add-crawler-pages-dialog/add-crawler-pages-dialog.component';

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
    'Result'
  ];

  user: string;

  loading: boolean;
  error: boolean;

  dataSource: any;
  selection: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private get: GetService) {
  }

  ngOnInit(): void {
    this.getListOfCrawls();
  }

  private getListOfCrawls(): void {
    this.get.listOfCrawls()
      .subscribe(crawls => {
        if (crawls !== null) {
          this.dataSource = new MatTableDataSource(crawls);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        } else {
          this.error = true;
        }
      });
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

  substringSubdomain(subdomain: string): string {
    return subdomain.substring(subdomain.indexOf('/') + 1);
  }

}
