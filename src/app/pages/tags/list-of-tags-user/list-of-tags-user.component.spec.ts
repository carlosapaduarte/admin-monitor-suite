import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfTagsUserComponent } from './list-of-tags-user.component';

describe('ListOfTagsUserComponent', () => {
  let component: ListOfTagsUserComponent;
  let fixture: ComponentFixture<ListOfTagsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfTagsUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfTagsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
