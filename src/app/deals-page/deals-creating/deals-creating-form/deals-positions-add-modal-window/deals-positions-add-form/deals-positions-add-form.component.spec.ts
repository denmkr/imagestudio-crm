import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsPositionsAddFormComponent } from './deals-positions-add-form.component';

describe('DealsPositionsAddFormComponent', () => {
  let component: DealsPositionsAddFormComponent;
  let fixture: ComponentFixture<DealsPositionsAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsPositionsAddFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsPositionsAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
