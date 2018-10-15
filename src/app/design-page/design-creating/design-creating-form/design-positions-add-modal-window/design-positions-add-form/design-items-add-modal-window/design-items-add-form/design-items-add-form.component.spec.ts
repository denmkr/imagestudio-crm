import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignItemsAddFormComponent } from './design-items-add-form.component';

describe('DesignItemsAddFormComponent', () => {
  let component: DesignItemsAddFormComponent;
  let fixture: ComponentFixture<DesignItemsAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignItemsAddFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignItemsAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
