import { Component, OnInit } from '@angular/core';

import { GetService } from '../../services/get.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  access_studies_users: number;
  access_studies_tags: number;
  access_studies_websites: number;

  my_monitor_users: number;
  my_monitor_websites: number;

  observatorio_tags: number;
  observatorio_websites: number;

  constructor(private get: GetService) {
    this.access_studies_users = 0;
    this.my_monitor_users = 0;
    this.access_studies_tags = 0;
    this.observatorio_tags = 0;
    this.access_studies_websites = 0;
    this.my_monitor_websites = 0;
    this.observatorio_websites = 0;
  }

  ngOnInit(): void {
    this.get.numberOfAcessStudiesUsers()
      .subscribe(total => {
        this.access_studies_users = total;
      });

    this.get.numberOfAccessStudiesTags()
      .subscribe(total => {
        this.access_studies_tags = total;
      });

    this.get.numberOfAccessStudiesWebsites()
      .subscribe(total => {
        this.access_studies_websites = total;
      });

    this.get.numberOfMyMonitorUsers()
      .subscribe(total => {
        this.my_monitor_users = total;
      });

    this.get.numberOfMyMonitorWebsites()
      .subscribe(total => {
        this.my_monitor_websites = total;
      });

    this.get.numberOfObservatorioTags()
      .subscribe(total => {
        this.observatorio_tags = total;
      });

    this.get.numberOfObservatorioWebsites()
      .subscribe(total => {
        this.observatorio_websites = total;
      });
  }
}
