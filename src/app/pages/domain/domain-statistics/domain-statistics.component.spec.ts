import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainStatisticsComponent } from './domain-statistics.component';

describe('DomainStatisticsComponent', () => {
  let component: DomainStatisticsComponent;
  let fixture: ComponentFixture<DomainStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
