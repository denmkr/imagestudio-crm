import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignPositionsAddFormComponent } from './design-positions-add-form.component';

describe('DesignPositionsAddFormComponent', () => {
  let component: DesignPositionsAddFormComponent;
  let fixture: ComponentFixture<DesignPositionsAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignPositionsAddFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignPositionsAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
