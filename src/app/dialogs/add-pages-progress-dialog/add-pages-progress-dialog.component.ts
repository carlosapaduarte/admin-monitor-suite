import { Component, OnInit, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as socketIo from 'socket.io-client';

import { ConfigService } from './../../services/config.service';
import { CreateService } from './../../services/create.service';

import { AddPagesProgressCloseConfirmationDialogComponent } from './../add-pages-progress-close-confirmation-dialog/add-pages-progress-close-confirmation-dialog.component';
import { AddPagesErrorsDialogComponent } from './../add-pages-errors-dialog/add-pages-errors-dialog.component';

@Component({
  selector: 'app-add-pages-progress-dialog',
  templateUrl: './add-pages-progress-dialog.component.html',
  styleUrls: ['./add-pages-progress-dialog.component.css']
})
export class AddPagesProgressDialogComponent implements OnInit, OnDestroy {

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
    private create: CreateService,
    private config: ConfigService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddPagesProgressDialogComponent>,
    private cd: ChangeDetectorRef
  ) {
    this.finished = false;
    this.current_uri = this.data.uris[0];
    this.n_uris = this.data.uris.length;
    this.elapsed_uris = 0;
    this.remaining_uris = this.n_uris;
    this.success_uris = 0;
    this.error_uris = 0;
    this.progress = 0;

    this.urisWithErrors = new Array<string>();

    this.socket = null;
  }

  ngOnInit(): void {
    this.addPages(this.data.domainId, JSON.stringify(this.data.uris), JSON.stringify(this.data.observatory_uris));
  }

  private addPages(domainId: number, uris: any, observatory: any): void {

    const formData = {
      domainId,
      uris,
      observatory
    };

    this.create.newPages(formData)
      .subscribe(success => {
        if (success) {
          this.socket = socketIo(this.config.getWSServer(''), { 'forceNew': true });
          this.socket.on('connect', () => {
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
                this.current_uri = this.data.uris[this.elapsed_uris];
                this.progress = (this.elapsed_uris * 100) / this.n_uris;

                if (this.elapsed_uris === this.n_uris) {
                  this.finished = true;
                }

                this.cd.detectChanges();
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
    this.socket.disconnect();
  }
}
