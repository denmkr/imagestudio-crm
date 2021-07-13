import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersItemEditModalComponent } from './orders-item-edit-modal.component';

describe('OrdersItemEditModalComponent', () => {
  let component: OrdersItemEditModalComponent;
  let fixture: ComponentFixture<OrdersItemEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersItemEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersItemEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
