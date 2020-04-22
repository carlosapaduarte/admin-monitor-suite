import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input('icon') icon: string;
  @Input('title') title: string;
  @Input('value') value: number;

  constructor() { }

  ngOnInit() {
  }

}
