import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsItemsAddFormComponent } from './deals-items-add-form.component';

describe('DealsItemsAddFormComponent', () => {
  let component: DealsItemsAddFormComponent;
  let fixture: ComponentFixture<DealsItemsAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsItemsAddFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsItemsAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
