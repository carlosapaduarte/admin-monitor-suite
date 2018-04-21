import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsitesPageComponent } from './websites-page.component';

describe('WebsitesPageComponent', () => {
  let component: WebsitesPageComponent;
  let fixture: ComponentFixture<WebsitesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsitesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsitesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
