import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {UpdateService} from '../../services/update.service';

@Component({
  selector: 'app-import-tag-dialog',
  templateUrl: './import-tag-dialog.component.html',
  styleUrls: ['./import-tag-dialog.component.css']
})
export class ImportTagDialogComponent implements OnInit {

  tag: string;
  tagId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private update: UpdateService,
  ) {
    this.tag = this.data.tag;
    this.tagId = this.data.tagId;
  }

  ngOnInit() {
  }

  importTag(): void {
    this.update.importTag({ tagId: this.tagId}).subscribe();
  }

}
