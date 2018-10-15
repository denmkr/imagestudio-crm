import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignItemsAddModalWindowComponent } from './design-items-add-modal-window.component';

describe('DesignItemsAddModalWindowComponent', () => {
  let component: DesignItemsAddModalWindowComponent;
  let fixture: ComponentFixture<DesignItemsAddModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignItemsAddModalWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignItemsAddModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
