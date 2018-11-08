import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsEditingComponent } from './deals-editing.component';

describe('DealsEditingComponent', () => {
  let component: DealsEditingComponent;
  let fixture: ComponentFixture<DealsEditingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsEditingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
