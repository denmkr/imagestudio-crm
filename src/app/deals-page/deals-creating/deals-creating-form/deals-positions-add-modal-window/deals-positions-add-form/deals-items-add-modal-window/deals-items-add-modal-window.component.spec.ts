import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsItemsAddModalWindowComponent } from './deals-items-add-modal-window.component';

describe('DealsItemsAddModalWindowComponent', () => {
  let component: DealsItemsAddModalWindowComponent;
  let fixture: ComponentFixture<DealsItemsAddModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsItemsAddModalWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsItemsAddModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
