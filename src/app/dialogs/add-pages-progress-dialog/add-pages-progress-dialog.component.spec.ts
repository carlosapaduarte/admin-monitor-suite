import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPagesProgressDialogComponent } from './add-pages-progress-dialog.component';

describe('AddPagesProgressDialogComponent', () => {
  let component: AddPagesProgressDialogComponent;
  let fixture: ComponentFixture<AddPagesProgressDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPagesProgressDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPagesProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
