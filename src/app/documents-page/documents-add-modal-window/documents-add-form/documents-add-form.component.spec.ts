import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsAddFormComponent } from './documents-add-form.component';

describe('DocumentsAddFormComponent', () => {
  let component: DocumentsAddFormComponent;
  let fixture: ComponentFixture<DocumentsAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsAddFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
