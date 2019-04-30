import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {GetService} from '../../../services/get.service';

import * as _ from 'lodash';
import {AddCrawlerPagesDialogComponent} from '../../../dialogs/add-crawler-pages-dialog/add-crawler-pages-dialog.component';
import {ImportWebsiteDialogComponent} from '../../../dialogs/import-website-dialog/import-website-dialog.component';
import {UpdateService} from '../../../services/update.service';

@Component({
  selector: 'app-list-of-websites-user',
  templateUrl: './list-of-websites-user.component.html',
  styleUrls: ['./list-of-websites-user.component.css']
})
export class ListOfWebsitesUserComponent implements OnInit {
  displayedColumns = [
    'Name',
    'Entity',
    'Creation_Date',
    'Import',
  ];

  // data source of domains
  dataSource: any;
  selection: any;

  loading: boolean;
  error: boolean;

  user: string;
  tag: string;
  userType: string;

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private activatedRoute: ActivatedRoute,
    private get: GetService,
    private update: UpdateService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.user = _.trim(params.user);
      this.tag = _.trim(params.tag);

        this.get.userType(this.user)
          .subscribe(type => {
            if (type !== null) {
              if (type !== 'monitor' && type !== 'studies') {
                this.error = true;
              } else {
                this.userType = type;
              }
            } else {
              this.error = true;
            }
            this.loading = false;
          });
      });

    if (this.userType === 'studies') {
      this.getListOfStudiesWebsites();
    } else {
      this.getListOfWebsites();
    }

  }

  applyFilter(filterValue: string): void {
    filterValue = _.trim(filterValue);
    filterValue = _.toLower(filterValue);
    this.dataSource.filter = filterValue;
  }

  private getListOfStudiesWebsites(): void {
    this.get.listOfStudiesTagWebsites(this.user, this.tag)
      .subscribe(websites => {
        if (websites !== null) {
          this.dataSource = new MatTableDataSource(websites);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        } else {
          this.error = true;
        }
        this.loading = false;
      });
  }

  private getListOfWebsites(): void {
    this.get.listOfUserWebsites(this.user)
      .subscribe(websites => {
        if (websites !== null) {
          this.dataSource = new MatTableDataSource(websites);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        } else {
          this.error = true;
        }
        this.loading = false;
      });
  }

  log(data: any): void {
    console.log(data);
  }

  openImportWebsiteDialog(website, websiteId, webName, url: string, hasDomain: boolean): void {
    console.log(url);
    const importWebsiteDialog = this.dialog.open(ImportWebsiteDialogComponent, {
      width: '40vw',
      data: {
        website: website,
        websiteId: websiteId,
        hasDomain: hasDomain,
        webName: webName,
        url: url
      }
    });
    importWebsiteDialog.afterClosed().subscribe(result => {
      if (result) {
        window.location.reload();
      }
    });
  }
}

