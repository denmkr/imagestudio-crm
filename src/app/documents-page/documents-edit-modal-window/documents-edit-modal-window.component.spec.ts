import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsEditModalWindowComponent } from './documents-edit-modal-window.component';

describe('DocumentsEditModalWindowComponent', () => {
  let component: DocumentsEditModalWindowComponent;
  let fixture: ComponentFixture<DocumentsEditModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsEditModalWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsEditModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
