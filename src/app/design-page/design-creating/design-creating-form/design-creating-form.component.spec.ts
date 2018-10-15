import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignCreatingFormComponent } from './design-creating-form.component';

describe('DesignCreatingFormComponent', () => {
  let component: DesignCreatingFormComponent;
  let fixture: ComponentFixture<DesignCreatingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignCreatingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignCreatingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
