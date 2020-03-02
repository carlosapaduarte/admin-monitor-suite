import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfEvaluationsComponent } from './list-of-evaluations.component';

describe('ListOfEvaluationsComponent', () => {
  let component: ListOfEvaluationsComponent;
  let fixture: ComponentFixture<ListOfEvaluationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfEvaluationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfEvaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
