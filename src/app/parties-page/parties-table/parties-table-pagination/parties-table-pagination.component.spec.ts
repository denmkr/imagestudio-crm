import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartiesTablePaginationComponent } from './parties-table-pagination.component';

describe('PartiesTablePaginationComponent', () => {
  let component: PartiesTablePaginationComponent;
  let fixture: ComponentFixture<PartiesTablePaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartiesTablePaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartiesTablePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
