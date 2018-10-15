import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignPositionsAddModalWindowComponent } from './design-positions-add-modal-window.component';

describe('DesignPositionsAddModalWindowComponent', () => {
  let component: DesignPositionsAddModalWindowComponent;
  let fixture: ComponentFixture<DesignPositionsAddModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignPositionsAddModalWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignPositionsAddModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
