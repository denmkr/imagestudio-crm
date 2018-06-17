import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsCreatingComponent } from './deals-creating.component';

describe('DealsCreatingComponent', () => {
  let component: DealsCreatingComponent;
  let fixture: ComponentFixture<DealsCreatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsCreatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsCreatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
