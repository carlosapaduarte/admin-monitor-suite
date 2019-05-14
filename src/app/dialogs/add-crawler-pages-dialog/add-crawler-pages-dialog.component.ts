import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import * as _ from 'lodash';
import {CrawlerDialogComponent} from '../crawler-dialog/crawler-dialog.component';
import {GetService} from '../../services/get.service';
import {CreateService} from '../../services/create.service';
import {MessageService} from '../../services/message.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-crawler-pages-dialog',
  templateUrl: './add-crawler-pages-dialog.component.html',
  styleUrls: ['./add-crawler-pages-dialog.component.css']
})
export class AddCrawlerPagesDialogComponent implements OnInit {

  displayedColumns = [
    'Uri',
    'select'
  ];

  pages: Array<any>;
  dataSource: MatTableDataSource<any>;
  selection: any;

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
    this.domainUri = this.data.domainUri;
    this.domainId = this.data.domainId;
    this.getUrisFromCrawlId();
    this.selection = new SelectionModel<any>(true, []);
  }

  ngOnInit(): void {
    this.submitted = false;
    //TODO verificacao dos resultados e do texto a apresentar.. tais como falha de crawler ou numero de links = 0
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
          this.dataSource = new MatTableDataSource(_.map(JSON.parse(cleanUris), u => ({Uri: u})));
        } else {
          this.error = true;
        }
      });
  }

  choosePages(e): void {
    e.preventDefault();
    this.submitted = true;
    this.addPages(JSON.stringify(_.map(this.selection.selected, 'Uri')), JSON.stringify([]));
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
      this.dataSource.data.forEach(row => this.selection.select(row));
  }


  private addPages(uris: any, observatorio: any): void {
    const domainId = this.domainId;
    const formData = {
      domainId,
      uris,
      observatorio
    };
    this.loading = true;
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
      });
  }
}
