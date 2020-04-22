import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  // show messages to the user
  show(message: string, duration: number = 5000, button: any = null): void {
    if (button) {
      this.translate.get([message, button.message]).subscribe((res: string[]) => {
        const snack = this.snackBar.open(res[message], res[button.message], {
          duration: duration,
        });
        snack.onAction().subscribe(() => {
          console.log(button.path);
          this.router.navigateByUrl(button.path);
        });
      });
    } else {
      this.translate.get([message, 'MISC.message_close']).subscribe((res: string[]) => {
        this.snackBar.open(res[message], res['MISC.message_close'], {
          duration: duration,
        });
      });
    }
  }
}
