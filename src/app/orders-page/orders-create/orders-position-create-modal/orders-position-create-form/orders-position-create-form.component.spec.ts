import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersPositionCreateFormComponent } from './orders-position-create-form.component';

describe('OrdersPositionCreateFormComponent', () => {
  let component: OrdersPositionCreateFormComponent;
  let fixture: ComponentFixture<OrdersPositionCreateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersPositionCreateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersPositionCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
