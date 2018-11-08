import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsItemsEditModalWindowComponent } from './deals-items-edit-modal-window.component';

describe('DealsItemsEditModalWindowComponent', () => {
  let component: DealsItemsEditModalWindowComponent;
  let fixture: ComponentFixture<DealsItemsEditModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsItemsEditModalWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsItemsEditModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
