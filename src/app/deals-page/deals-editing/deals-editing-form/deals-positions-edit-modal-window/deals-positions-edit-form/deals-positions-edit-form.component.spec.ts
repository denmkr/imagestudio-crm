import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsPositionsEditFormComponent } from './deals-positions-edit-form.component';

describe('DealsPositionsEditFormComponent', () => {
  let component: DealsPositionsEditFormComponent;
  let fixture: ComponentFixture<DealsPositionsEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsPositionsEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsPositionsEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
