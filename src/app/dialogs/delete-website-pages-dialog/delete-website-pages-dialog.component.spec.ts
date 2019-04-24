import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWebsitePagesDialogComponent } from './delete-website-pages-dialog.component';

describe('DeleteWebsitePagesDialogComponent', () => {
  let component: DeleteWebsitePagesDialogComponent;
  let fixture: ComponentFixture<DeleteWebsitePagesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteWebsitePagesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteWebsitePagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
