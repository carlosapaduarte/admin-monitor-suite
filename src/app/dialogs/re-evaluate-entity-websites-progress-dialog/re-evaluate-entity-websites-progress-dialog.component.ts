import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import * as socketIo from 'socket.io-client';
import { Socket } from 'ngx-socket-io';
import * as _ from 'lodash';

import { ConfigService } from './../../services/config.service';
import { UpdateService } from './../../services/update.service';

import { AddPagesProgressCloseConfirmationDialogComponent } from './../add-pages-progress-close-confirmation-dialog/add-pages-progress-close-confirmation-dialog.component';
import { AddPagesErrorsDialogComponent } from './../add-pages-errors-dialog/add-pages-errors-dialog.component';


@Component({
  selector: 'app-re-evaluate-entity-websites-progress-dialog',
  templateUrl: './re-evaluate-entity-websites-progress-dialog.component.html',
  styleUrls: ['./re-evaluate-entity-websites-progress-dialog.component.css']
})
export class ReEvaluateEntityWebsitesProgressDialogComponent implements OnInit, OnDestroy {

  finished: boolean;
  skipping: boolean;
  current_website: string;
  current_uri: string;
  n_websites: number;
  n_uris: number;
  elapsed_websites: number;
  elapsed_uris: number;
  remaining_websites: number;
  remaining_uris: number;
  success_websites: number;
  success_uris: number;
  error_websites: number;
  error_uris: number;
  progress_websites: number;
  progress_uris: number;

  websitesWithErrors: Array<string>;
  urisWithErrors: Array<string>;

  //socket: socketIo.SocketIo;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private update: UpdateService,
    private config: ConfigService,
    private dialog: MatDialog,
    private socket: Socket,
    private dialogRef: MatDialogRef<ReEvaluateEntityWebsitesProgressDialogComponent>
  ) {
    this.finished = false;
    this.skipping = true;

    this.current_website = '';
    this.current_uri = '';
    this.n_websites = 0;
    this.n_uris = 0;
    this.elapsed_websites = 0;
    this.elapsed_uris = 0;
    this.remaining_websites = 0;
    this.remaining_uris = 0;
    this.success_websites = 0;
    this.success_uris = 0;
    this.error_websites = 0;
    this.error_uris = 0;
    this.progress_websites = 0;
    this.progress_uris = 0;

    this.websitesWithErrors = new Array<string>();
    this.urisWithErrors = new Array<string>();

    //this.socket = null;
    this.socket.connect();
  }

  ngOnInit(): void {
    this.socket.emit('entity', { entityId: this.data.info, option: this.data.option, token: localStorage.getItem('AMS-SSID')});
    this.socket.on('startupEntity', data => {
      this.n_websites = data;
      this.remaining_websites = this.n_websites;
    });
    this.socket.on('startupWebsite', data => {
      this.skipping = false;
      this.current_website = data.current_website;
      this.n_uris = data.n_uris;
      this.remaining_uris = this.n_uris;
      this.elapsed_uris = 0;
      this.success_uris = 0;
      this.error_uris = 0;
      this.progress_uris = 0;
    });
    this.socket.on('currentUri', data => {
      this.current_uri = decodeURIComponent(data);
    });
    this.socket.on('websiteFinished', data => {
      if (this.current_website === data) {
        if (!_.includes(this.websitesWithErrors, this.current_website)) {
          this.success_websites++;
        } else {
          this.error_websites++;
        }

        this.elapsed_websites = this.success_websites - this.error_websites;
        this.remaining_websites = this.n_websites - this.elapsed_websites;
        this.progress_websites = (this.elapsed_websites * 100) / this.n_websites;

        if (this.elapsed_websites === this.n_websites) {
          this.finished = true;
        }
      }
    });
    this.socket.on('evaluated', data => {
      if (decodeURIComponent(data.uri) === this.current_uri) {
        if (data.success) {
          this.success_uris++;
        } else {
          this.error_uris++;
          this.urisWithErrors.push(decodeURIComponent(data.uri));
        }

        this.elapsed_uris = this.success_uris + this.error_uris;
        this.remaining_uris = this.n_uris - this.elapsed_uris;
        this.progress_uris = (this.elapsed_uris * 100) / this.n_uris;

        if (this.elapsed_uris === this.n_uris) {
          this.finished = true;
        }
      }
    });
  }

  skipWebsite(): void {
    this.skipping = true;
    this.socket.emit('skip', true);
  }

  openUrisWithErrorsDialog(): void {
    this.dialogRef.close();
    this.dialog.open(AddPagesErrorsDialogComponent, {
      width: '40vw',
      data: this.urisWithErrors
    });
  }

  closeDialog(): void {
    if (this.finished) {
      this.dialogRef.close();
    } else {
      const dialog = this.dialog.open(AddPagesProgressCloseConfirmationDialogComponent);
      dialog.afterClosed().subscribe(result => {
        if (result === 'true') {
          this.socket.emit('cancel', true);
          this.dialogRef.close();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
