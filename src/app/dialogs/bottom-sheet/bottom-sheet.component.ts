import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { AddTagDialogComponent } from '../add-tag-dialog/add-tag-dialog.component';
import { AddEntityDialogComponent } from '../add-entity-dialog/add-entity-dialog.component';
import { AddWebsiteDialogComponent } from '../add-website-dialog/add-website-dialog.component';
import { AddDomainDialogComponent } from '../add-domain-dialog/add-domain-dialog.component';
import { AddPageDialogComponent } from '../add-page-dialog/add-page-dialog.component';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.css']
})
export class BottomSheetComponent implements OnInit {

  constructor(private dialog: MatDialog, private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>) { }

  ngOnInit() {
  }

  openAddUserDialog(e): void {
    this.bottomSheetRef.dismiss();
    e.preventDefault();

    this.dialog.open(AddUserDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true
    });
  }

  openAddTagDialog(e): void {
    this.bottomSheetRef.dismiss();
    e.preventDefault();

    this.dialog.open(AddTagDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true
    });
  }

  openAddEntityDialog(e): void {
    this.bottomSheetRef.dismiss();
    e.preventDefault();

    this.dialog.open(AddEntityDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true
    });
  }

  openAddWebsiteDialog(e): void {
    this.bottomSheetRef.dismiss();
    e.preventDefault();

    this.dialog.open(AddWebsiteDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true
    });
  }

  openAddDomainDialog(e): void {
    this.bottomSheetRef.dismiss();
    e.preventDefault();

    this.dialog.open(AddDomainDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true
    });
  }

  openAddPageDialog(e): void {
    this.bottomSheetRef.dismiss();
    e.preventDefault();

    this.dialog.open(AddPageDialogComponent, {
      width: '60vw',
      disableClose: false,
      hasBackdrop: true
    });
  }
}
