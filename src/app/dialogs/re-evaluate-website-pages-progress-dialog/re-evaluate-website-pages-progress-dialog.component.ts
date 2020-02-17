import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as socketIo from 'socket.io-client';
import * as _ from 'lodash';

import { ConfigService } from './../../services/config.service';
import { UpdateService } from './../../services/update.service';

import { AddPagesProgressCloseConfirmationDialogComponent } from './../add-pages-progress-close-confirmation-dialog/add-pages-progress-close-confirmation-dialog.component';
import { AddPagesErrorsDialogComponent } from './../add-pages-errors-dialog/add-pages-errors-dialog.component';

@Component({
  selector: 'app-re-evaluate-website-pages-progress-dialog',
  templateUrl: './re-evaluate-website-pages-progress-dialog.component.html',
  styleUrls: ['./re-evaluate-website-pages-progress-dialog.component.css']
})
export class ReEvaluateWebsitePagesProgressDialogComponent implements OnInit, OnDestroy {

  finished: boolean;
  current_uri: string;
  n_uris: number;
  elapsed_uris: number;
  remaining_uris: number;
  success_uris: number;
  error_uris: number;
  progress: number;

  urisWithErrors: Array<string>;

  socket: socketIo.SocketIo;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private update: UpdateService,
    private config: ConfigService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ReEvaluateWebsitePagesProgressDialogComponent>
  ) {
    this.finished = false;
    this.current_uri = '';
    this.n_uris = 0;
    this.elapsed_uris = 0;
    this.remaining_uris = 0;
    this.success_uris = 0;
    this.error_uris = 0;
    this.progress = 0;

    this.urisWithErrors = new Array<string>();

    this.socket = null;
  }

  ngOnInit(): void {
    this.update.reEvaluateWebsitePages({domainId: this.data.info, option: this.data.option})
      .subscribe(success => {
        if (success) {
          this.socket = socketIo(this.config.getWSServer('/'), { 'forceNew': true });
          this.socket.once('connect', () => {
            this.socket.on('startup', data => {
              this.n_uris = _.clone(data);
              this.remaining_uris = _.clone(this.n_uris);
            });

            this.socket.on('current_uri', data => {
              this.current_uri = _.clone(decodeURIComponent(data));
            });

            this.socket.on('message', data => {
              if (decodeURIComponent(data.uri) === this.current_uri) {
                if (data.success) {
                  this.success_uris++;
                } else {
                  this.error_uris++;
                  this.urisWithErrors.push(decodeURIComponent(data.uri));
                }

                this.elapsed_uris = this.success_uris + this.error_uris;
                this.remaining_uris = this.n_uris - this.elapsed_uris;
                this.progress = (this.elapsed_uris * 100) / this.n_uris;

                if (this.elapsed_uris === this.n_uris) {
                  this.finished = true;
                }
              }
            });
          });
        }
      });
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
          this.socket.emit('message', 'cancel');
          this.dialogRef.close();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.socket.removeAllListeners();
    this.socket.disconnect();
  }
}
