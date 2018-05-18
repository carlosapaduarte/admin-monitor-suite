import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfEntitiesComponent } from './list-of-entities.component';

describe('ListOfEntitiesComponent', () => {
  let component: ListOfEntitiesComponent;
  let fixture: ComponentFixture<ListOfEntitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfEntitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
