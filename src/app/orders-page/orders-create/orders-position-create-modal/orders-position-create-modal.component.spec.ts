import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersPositionCreateModalComponent } from './orders-position-create-modal.component';

describe('OrdersPositionCreateModalComponent', () => {
  let component: OrdersPositionCreateModalComponent;
  let fixture: ComponentFixture<OrdersPositionCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersPositionCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersPositionCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
