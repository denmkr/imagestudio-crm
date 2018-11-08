import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsPositionsEditModalWindowComponent } from './deals-positions-edit-modal-window.component';

describe('DealsPositionsEditModalWindowComponent', () => {
  let component: DealsPositionsEditModalWindowComponent;
  let fixture: ComponentFixture<DealsPositionsEditModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsPositionsEditModalWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsPositionsEditModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
