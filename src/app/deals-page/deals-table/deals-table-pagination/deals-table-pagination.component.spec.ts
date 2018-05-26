import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsTablePaginationComponent } from './deals-table-pagination.component';

describe('DealsTablePaginationComponent', () => {
  let component: DealsTablePaginationComponent;
  let fixture: ComponentFixture<DealsTablePaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsTablePaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsTablePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
