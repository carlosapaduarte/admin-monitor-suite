import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrawlerPagesDialogComponent } from './add-crawler-pages-dialog.component';

describe('AddCrawlerPagesDialogComponent', () => {
  let component: AddCrawlerPagesDialogComponent;
  let fixture: ComponentFixture<AddCrawlerPagesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCrawlerPagesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCrawlerPagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
