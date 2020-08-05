import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityStatisticsComponent } from './entity-statistics.component';

describe('EntityStatisticsComponent', () => {
  let component: EntityStatisticsComponent;
  let fixture: ComponentFixture<EntityStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
