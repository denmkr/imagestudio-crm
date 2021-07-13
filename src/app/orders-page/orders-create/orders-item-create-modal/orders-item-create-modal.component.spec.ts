import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersItemCreateModalComponent } from './orders-item-create-modal.component';

describe('OrdersItemCreateModalComponent', () => {
  let component: OrdersItemCreateModalComponent;
  let fixture: ComponentFixture<OrdersItemCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersItemCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersItemCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
