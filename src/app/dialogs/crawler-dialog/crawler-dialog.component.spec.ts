import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrawlerDialogComponent } from './crawler-dialog.component';

describe('CrawlerDialogComponent', () => {
  let component: CrawlerDialogComponent;
  let fixture: ComponentFixture<CrawlerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrawlerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrawlerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
