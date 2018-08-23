import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsColumnsComponent } from './deals-columns.component';

describe('DealsColumnsComponent', () => {
  let component: DealsColumnsComponent;
  let fixture: ComponentFixture<DealsColumnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsColumnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
