import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsPositionsAddModalWindowComponent } from './deals-positions-add-modal-window.component';

describe('DealsPositionsAddModalWindowComponent', () => {
  let component: DealsPositionsAddModalWindowComponent;
  let fixture: ComponentFixture<DealsPositionsAddModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsPositionsAddModalWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsPositionsAddModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
