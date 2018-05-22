import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsAddModalWindowComponent } from './documents-add-modal-window.component';

describe('DocumentsAddModalWindowComponent', () => {
  let component: DocumentsAddModalWindowComponent;
  let fixture: ComponentFixture<DocumentsAddModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsAddModalWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsAddModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
