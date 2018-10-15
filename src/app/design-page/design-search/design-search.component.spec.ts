import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignSearchComponent } from './design-search.component';

describe('DesignSearchComponent', () => {
  let component: DesignSearchComponent;
  let fixture: ComponentFixture<DesignSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
