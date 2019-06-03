import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePagesToReEvaluateDialogComponent } from './choose-pages-to-re-evaluate-dialog.component';

describe('ChoosePagesToReEvaluateDialogComponent', () => {
  let component: ChoosePagesToReEvaluateDialogComponent;
  let fixture: ComponentFixture<ChoosePagesToReEvaluateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosePagesToReEvaluateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePagesToReEvaluateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
