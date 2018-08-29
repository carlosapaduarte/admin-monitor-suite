import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePageDialogComponent } from './delete-page-dialog.component';

describe('DeletePageDialogComponent', () => {
  let component: DeletePageDialogComponent;
  let fixture: ComponentFixture<DeletePageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletePageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
