import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainsPageComponent } from './domains-page.component';

describe('DomainsPageComponent', () => {
  let component: DomainsPageComponent;
  let fixture: ComponentFixture<DomainsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
