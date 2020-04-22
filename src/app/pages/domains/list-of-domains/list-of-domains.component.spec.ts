import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfDomainsComponent } from './list-of-domains.component';

describe('ListOfDomainsComponent', () => {
  let component: ListOfDomainsComponent;
  let fixture: ComponentFixture<ListOfDomainsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfDomainsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
