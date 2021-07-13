import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersPositionEditModalComponent } from './orders-position-edit-modal.component';

describe('OrdersPositionEditModalComponent', () => {
  let component: OrdersPositionEditModalComponent;
  let fixture: ComponentFixture<OrdersPositionEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersPositionEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersPositionEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
