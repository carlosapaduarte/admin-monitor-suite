import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseObservatoryPagesDialogComponent } from './choose-observatory-pages-dialog.component';

describe('ChooseObservatoryPagesDialogComponent', () => {
  let component: ChooseObservatoryPagesDialogComponent;
  let fixture: ComponentFixture<ChooseObservatoryPagesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseObservatoryPagesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseObservatoryPagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
