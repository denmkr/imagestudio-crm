import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersItemCreateFormComponent } from './orders-item-create-form.component';

describe('OrdersItemCreateFormComponent', () => {
  let component: OrdersItemCreateFormComponent;
  let fixture: ComponentFixture<OrdersItemCreateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersItemCreateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersItemCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
