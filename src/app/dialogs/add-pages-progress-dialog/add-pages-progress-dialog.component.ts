import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import * as socketIo from 'socket.io-client';
import { Socket } from 'ngx-socket-io';

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

  cancel: boolean;
  urisWithErrors: Array<string>;

  //socket: socketIo.SocketIo;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private location: Location,
    private socket: Socket,
    private create: CreateService,
    private config: ConfigService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddPagesProgressDialogComponent>
  ) {
    this.finished = false;
    this.current_uri = this.data.uris[0];
    this.n_uris = this.data.uris.length;
    this.elapsed_uris = 0;
    this.remaining_uris = this.n_uris;
    this.success_uris = 0;
    this.error_uris = 0;
    this.progress = 0;

    this.cancel = false;
    this.urisWithErrors = new Array<string>();
    this.socket.connect();
  }

  ngOnInit(): void {
    this.addPages(this.data.domainId, this.data.uris, this.data.observatory_uris);
  }

  private addPages(domainId: number, uris: any, observatory_uris: any): void {

    uris = uris.map(uri => {
      uri = uri.replace('https://', '').replace('http://', '').replace('www.', '')
      uri = encodeURIComponent(uri);
      return uri;
    });
    
    observatory_uris = observatory_uris.map(uri => {
      uri = uri.replace('https://', '').replace('http://', '').replace('www.', '')
      uri = encodeURIComponent(uri);
      return uri;
    });

    this.socket.emit('pages', { domainId, uris: JSON.stringify(uris), observatory: JSON.stringify(observatory_uris), token: localStorage.getItem('AMS-SSID')});
    this.socket.on('evaluated', (data: any) => {
      if (data.success) {
        this.success_uris++;
      } else {
        this.error_uris++;
        this.urisWithErrors.push(decodeURIComponent(data.uri));
      }

      this.elapsed_uris = this.success_uris + this.error_uris;
      this.remaining_uris = this.n_uris - this.elapsed_uris;
      this.current_uri = decodeURIComponent(this.data.uris[this.elapsed_uris]);
      this.progress = (this.elapsed_uris * 100) / this.n_uris;

      if (this.elapsed_uris === this.n_uris) {
        this.finished = true;
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
      if (this.location.path() !== '/console/pages') {
        this.router.navigateByUrl('/console/pages');
      } else {
        window.location.reload();
      }
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
