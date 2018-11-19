import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsPositionsCreatingFormComponent } from './deals-positions-creating-form.component';

describe('DealsPositionsCreatingFormComponent', () => {
  let component: DealsPositionsCreatingFormComponent;
  let fixture: ComponentFixture<DealsPositionsCreatingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsPositionsCreatingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsPositionsCreatingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
