import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsEditingFormComponent } from './deals-editing-form.component';

describe('DealsEditingFormComponent', () => {
  let component: DealsEditingFormComponent;
  let fixture: ComponentFixture<DealsEditingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsEditingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsEditingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
