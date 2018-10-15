import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignColumnsComponent } from './design-columns.component';

describe('DesignColumnsComponent', () => {
  let component: DesignColumnsComponent;
  let fixture: ComponentFixture<DesignColumnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignColumnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
