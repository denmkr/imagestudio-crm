import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsSearchComponent } from './deals-search.component';

describe('DealsSearchComponent', () => {
  let component: DealsSearchComponent;
  let fixture: ComponentFixture<DealsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
