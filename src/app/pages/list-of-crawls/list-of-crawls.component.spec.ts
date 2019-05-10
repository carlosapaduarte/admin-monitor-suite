import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfCrawlsComponent } from './list-of-crawls.component';

describe('ListOfCrawlsComponent', () => {
  let component: ListOfCrawlsComponent;
  let fixture: ComponentFixture<ListOfCrawlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfCrawlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfCrawlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
