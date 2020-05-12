import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UpdateService } from '../../services/update.service';

@Component({
  selector: 'app-evaluation-error-dialog',
  templateUrl: './evaluation-error-dialog.component.html',
  styleUrls: ['./evaluation-error-dialog.component.css']
})
export class EvaluationErrorDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: any,
    private dialogRef: MatDialogRef<EvaluationErrorDialogComponent>,
    private readonly update: UpdateService
  ) { }

  ngOnInit(): void {
  }

  tryAgain(): void {
    this.update.evaluationListError(this.data.evaluationListId)
      .subscribe((result: boolean) => {
        if (result) {
          this.dialogRef.close();
        }
      });
  }
}
