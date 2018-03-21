import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartiesAddFormComponent } from './parties-add-form.component';

describe('PartiesAddFormComponent', () => {
  let component: PartiesAddFormComponent;
  let fixture: ComponentFixture<PartiesAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartiesAddFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartiesAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
