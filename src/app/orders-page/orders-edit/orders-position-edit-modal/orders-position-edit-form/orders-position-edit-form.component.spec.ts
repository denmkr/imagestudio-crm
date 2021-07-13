import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersPositionEditFormComponent } from './orders-position-edit-form.component';

describe('OrdersPositionEditFormComponent', () => {
  let component: OrdersPositionEditFormComponent;
  let fixture: ComponentFixture<OrdersPositionEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersPositionEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersPositionEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
