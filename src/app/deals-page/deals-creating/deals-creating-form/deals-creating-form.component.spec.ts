import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsCreatingFormComponent } from './deals-creating-form.component';

describe('DealsCreatingFormComponent', () => {
  let component: DealsCreatingFormComponent;
  let fixture: ComponentFixture<DealsCreatingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsCreatingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsCreatingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
