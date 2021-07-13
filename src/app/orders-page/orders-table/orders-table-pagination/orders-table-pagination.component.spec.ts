import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersTablePaginationComponent } from './orders-table-pagination.component';

describe('OrdersTablePaginationComponent', () => {
  let component: OrdersTablePaginationComponent;
  let fixture: ComponentFixture<OrdersTablePaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersTablePaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersTablePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
