import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEvaluationDialogComponent } from './delete-evaluation-dialog.component';

describe('DeleteEvaluationDialogComponent', () => {
  let component: DeleteEvaluationDialogComponent;
  let fixture: ComponentFixture<DeleteEvaluationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteEvaluationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteEvaluationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
