import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAdditionDialogComponent } from './confirm-addition-dialog.component';

describe('ConfirmAdditionDialogComponent', () => {
  let component: ConfirmAdditionDialogComponent;
  let fixture: ComponentFixture<ConfirmAdditionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmAdditionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAdditionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
