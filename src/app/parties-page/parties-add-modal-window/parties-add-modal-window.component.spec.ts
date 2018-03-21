import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartiesAddModalWindowComponent } from './parties-add-modal-window.component';

describe('PartiesAddModalWindowComponent', () => {
  let component: PartiesAddModalWindowComponent;
  let fixture: ComponentFixture<PartiesAddModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartiesAddModalWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartiesAddModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
