import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfWebsitesUserComponent } from './list-of-websites-user.component';

describe('ListOfWebsitesUserComponent', () => {
  let component: ListOfWebsitesUserComponent;
  let fixture: ComponentFixture<ListOfWebsitesUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfWebsitesUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfWebsitesUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
