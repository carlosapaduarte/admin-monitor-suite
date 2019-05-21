import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReEvaluateTagWebsitesProgressDialogComponent } from './re-evaluate-tag-websites-progress-dialog.component';

describe('ReEvaluateTagWebsitesProgressDialogComponent', () => {
  let component: ReEvaluateTagWebsitesProgressDialogComponent;
  let fixture: ComponentFixture<ReEvaluateTagWebsitesProgressDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReEvaluateTagWebsitesProgressDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReEvaluateTagWebsitesProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
