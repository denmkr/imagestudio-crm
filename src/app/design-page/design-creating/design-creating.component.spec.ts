import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignCreatingComponent } from './design-creating.component';

describe('DesignCreatingComponent', () => {
  let component: DesignCreatingComponent;
  let fixture: ComponentFixture<DesignCreatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignCreatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignCreatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
