import {Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import * as _ from 'lodash';
import {GetService} from '../../services/get.service';
import {CreateService} from '../../services/create.service';
import {MessageService} from '../../services/message.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

import {
  AddPagesProgressDialogComponent
} from '../add-pages-progress-dialog/add-pages-progress-dialog.component';

@Component({
  selector: 'app-add-crawler-pages-dialog',
  templateUrl: './add-crawler-pages-dialog.component.html',
  styleUrls: ['./add-crawler-pages-dialog.component.css']
})
export class AddCrawlerPagesDialogComponent implements OnInit {

  displayedColumns = [
    'Uri',
    'import',
    'observatorio'
  ];

  pages: Array<any>;
  dataSource: MatTableDataSource<any>;
  selectionImport: any;
  selectionObserv: any;

  crawlDomainId: number;
  domainUri: string;
  domainId: number;
  error = false;
  loading = false;
  submitted: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddCrawlerPagesDialogComponent>,
    private dialog: MatDialog,
    private get: GetService,
    private create: CreateService,
    private msg: MessageService,
    private router: Router,
    private location: Location
  ) {
    this.crawlDomainId = this.data.crawlDomainId;
    this.getUrisFromCrawlId();
    this.domainUri = this.data.domainUri;
    this.domainId = this.data.domainId;
    this.selectionImport = new SelectionModel<any>(true, []);
    this.selectionObserv = new SelectionModel<any>(true, []);
  }

  ngOnInit(): void {
    this.submitted = false;
  }

  private getUrisFromCrawlId() {
    this.get.listOfUrisFromCrawlDomainId(this.crawlDomainId)
      .subscribe(uris => {
        if (uris !== null) {
          const cleanUris = JSON.stringify(_.map(uris, p => {
            let uriToClean = p['Uri'];
            uriToClean = _.replace(uriToClean, 'http://', '');
            uriToClean = _.replace(uriToClean, 'https://', '');
            uriToClean = _.replace(uriToClean, 'www.', '');

            if (uriToClean[_.size(uriToClean) - 1] === '/') {
              uriToClean = uriToClean.substring(0, _.size(uriToClean) - 1);
            }

            return _.trim(uriToClean);
          }));
          this.dataSource = new MatTableDataSource(_.map(JSON.parse(cleanUris), u => ({Uri: decodeURIComponent(u)})));
        } else {
          this.error = true;
        }
      });
  }

  choosePages(e): void {
    e.preventDefault();
    this.submitted = true;
    this.addPages(JSON.stringify(_.map(this.selectionImport.selected, 'Uri')), JSON.stringify(_.map(this.selectionObserv.selected, 'Uri')));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedImport() {
    const numSelected = this.selectionImport.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isAllSelectedObserv() {
    const numSelected = this.selectionObserv.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleImport() {
    this.isAllSelectedImport() ?
      this.dataSource.data.forEach(row => {
        if (!this.selectionObserv.isSelected(row)) {
          this.selectionImport.deselect(row);
        }
      }) : this.dataSource.data.forEach(row => this.selectionImport.select(row));
  }

  masterToggleObserv() {
    this.isAllSelectedObserv() ?
      this.selectionObserv.clear() :
      this.dataSource.data.forEach(row => this.selectionObserv.select(row));
    this.masterToggleImport();
  }

  toggleBoth(row: any) {
    this.selectionImport.select(row);
    this.selectionObserv.toggle(row);
  }

  private addPages(uris: any, observatorio: any): void {
    const domainId = this.domainId;
    /*const formData = {
      domainId,
      uris,
      observatorio
    };*/

    this.dialog.open(AddPagesProgressDialogComponent, {
      width: '40vw',
      disableClose: true,
      data: {
        domainId: domainId,
        uris: JSON.parse(uris),
        observatory_uris: JSON.parse(observatorio)
      }
    });

    this.dialogRef.close();

    /*this.loading = true;
    this.create.newPages(formData)
      .subscribe(success => {
        if (success !== null) {
          if (success) {
            this.dialogRef.close();
            this.loading = false;
            this.msg.show('CRAWLER.MESSAGE.success');
            if (this.location.path() !== '/console/pages') {
              this.router.navigateByUrl('/console/pages');
            } else {
              window.location.reload();
            }
          }
        }
      });*/
  }
}
