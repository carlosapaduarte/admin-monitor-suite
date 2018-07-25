import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfWebsitesComponent } from './list-of-websites.component';

describe('ListOfWebsitesComponent', () => {
  let component: ListOfWebsitesComponent;
  let fixture: ComponentFixture<ListOfWebsitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfWebsitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfWebsitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
