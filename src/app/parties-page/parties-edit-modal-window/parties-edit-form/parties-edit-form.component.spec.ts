import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartiesEditFormComponent } from './parties-edit-form.component';

describe('PartiesEditFormComponent', () => {
  let component: PartiesEditFormComponent;
  let fixture: ComponentFixture<PartiesEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartiesEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartiesEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
