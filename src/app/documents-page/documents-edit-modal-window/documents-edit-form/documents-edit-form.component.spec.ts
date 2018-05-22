import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsEditFormComponent } from './documents-edit-form.component';

describe('DocumentsEditFormComponent', () => {
  let component: DocumentsEditFormComponent;
  let fixture: ComponentFixture<DocumentsEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
