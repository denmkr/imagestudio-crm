import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsItemsEditFormComponent } from './deals-items-edit-form.component';

describe('DealsItemsEditFormComponent', () => {
  let component: DealsItemsEditFormComponent;
  let fixture: ComponentFixture<DealsItemsEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsItemsEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsItemsEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
