import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersItemEditFormComponent } from './orders-item-edit-form.component';

describe('OrdersItemEditFormComponent', () => {
  let component: OrdersItemEditFormComponent;
  let fixture: ComponentFixture<OrdersItemEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersItemEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersItemEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
