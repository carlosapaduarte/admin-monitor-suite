import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReEvaluateWebsitePagesProgressDialogComponent } from './re-evaluate-website-pages-progress-dialog.component';

describe('ReEvaluateWebsitePagesProgressDialogComponent', () => {
  let component: ReEvaluateWebsitePagesProgressDialogComponent;
  let fixture: ComponentFixture<ReEvaluateWebsitePagesProgressDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReEvaluateWebsitePagesProgressDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReEvaluateWebsitePagesProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
