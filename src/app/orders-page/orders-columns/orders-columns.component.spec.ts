import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersColumnsComponent } from './orders-columns.component';

describe('OrdersColumnsComponent', () => {
  let component: OrdersColumnsComponent;
  let fixture: ComponentFixture<OrdersColumnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersColumnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
