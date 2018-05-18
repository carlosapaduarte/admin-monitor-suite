import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfTagsComponent } from './list-of-tags.component';

describe('ListOfTagsComponent', () => {
  let component: ListOfTagsComponent;
  let fixture: ComponentFixture<ListOfTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
