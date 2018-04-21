import { OnInit, Component, Injectable, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs/observable/merge';
import * as _ from 'lodash';

@Injectable()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('scrollRef') scrollRef: any;

  selectedLang: string;
  langs: {} = {
    'pt': 'Portuguese',
    'en': 'English'
  };

  showGoToTop: boolean;

  constructor(public translate: TranslateService) {

    this.translate.addLangs(_.values(this.langs));
    this.translate.setDefaultLang('Portuguese');

    const lang = localStorage.getItem('language');

    if (!lang) {
      const browserLang = translate.getBrowserLang();
      const use = _.includes(_.keys(this.langs), browserLang) ? this.langs[browserLang] : 'Portuguese';

      this.translate.use(use);
      localStorage.setItem('language', use);
    } else {
      this.translate.use(lang);
    }

    this.selectedLang = this.translate.currentLang;

    this.showGoToTop = false;
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    merge(this.scrollRef.directiveRef.PS_SCROLL_DOWN, this.scrollRef.directiveRef.PS_SCROLL_UP)
      .subscribe(() => {
        const y = this.scrollRef.directiveRef.geometry().y;

        if (y > 300) {
          this.showGoToTop = true;
        } else {
          this.showGoToTop = false;
        }
      });
  }

  changeLanguage(): void {
    this.translate.use(this.selectedLang);
    localStorage.setItem('language', this.selectedLang);
  }

  goToTop(): void {
    this.scrollRef.directiveRef.scrollToTop(0, 250);
  }
}
