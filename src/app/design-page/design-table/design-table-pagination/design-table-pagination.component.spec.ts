import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignTablePaginationComponent } from './design-table-pagination.component';

describe('DesignTablePaginationComponent', () => {
  let component: DesignTablePaginationComponent;
  let fixture: ComponentFixture<DesignTablePaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignTablePaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignTablePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
