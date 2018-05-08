import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartiesEditModalWindowComponent } from './parties-edit-modal-window.component';

describe('PartiesEditModalWindowComponent', () => {
  let component: PartiesEditModalWindowComponent;
  let fixture: ComponentFixture<PartiesEditModalWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartiesEditModalWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartiesEditModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
