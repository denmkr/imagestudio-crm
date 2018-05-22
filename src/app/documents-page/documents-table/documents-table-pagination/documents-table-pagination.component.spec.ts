import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsTablePaginationComponent } from './documents-table-pagination.component';

describe('DocumentsTablePaginationComponent', () => {
  let component: DocumentsTablePaginationComponent;
  let fixture: ComponentFixture<DocumentsTablePaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsTablePaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsTablePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
