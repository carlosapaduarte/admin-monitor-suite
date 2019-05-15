import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPagesProgressCloseConfirmationDialogComponent } from './add-pages-progress-close-confirmation-dialog.component';

describe('AddPagesProgressCloseConfirmationDialogComponent', () => {
  let component: AddPagesProgressCloseConfirmationDialogComponent;
  let fixture: ComponentFixture<AddPagesProgressCloseConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPagesProgressCloseConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPagesProgressCloseConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
