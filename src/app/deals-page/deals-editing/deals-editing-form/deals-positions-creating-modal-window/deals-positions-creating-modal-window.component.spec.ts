import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsPositionsCreatingModalWindowComponent } from './deals-positions-creating-modal-window.component';

describe('DealsPositionsCreatingModalWindowComponent', () => {
  let component: DealsPositionsCreatingModalWindowComponent;
  let fixture: ComponentFixture<DealsPositionsCreatingModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsPositionsCreatingModalWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsPositionsCreatingModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
