import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTagDialogComponent } from './import-tag-dialog.component';

describe('ImportTagDialogComponent', () => {
  let component: ImportTagDialogComponent;
  let fixture: ComponentFixture<ImportTagDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportTagDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTagDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
