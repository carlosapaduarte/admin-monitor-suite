import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReEvaluateEntityWebsitesProgressDialogComponent } from './re-evaluate-entity-websites-progress-dialog.component';

describe('ReEvaluateEntityWebsitesProgressDialogComponent', () => {
  let component: ReEvaluateEntityWebsitesProgressDialogComponent;
  let fixture: ComponentFixture<ReEvaluateEntityWebsitesProgressDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReEvaluateEntityWebsitesProgressDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReEvaluateEntityWebsitesProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
