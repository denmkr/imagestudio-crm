import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartiesSearchComponent } from './parties-search.component';

describe('PartiesSearchComponent', () => {
  let component: PartiesSearchComponent;
  let fixture: ComponentFixture<PartiesSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartiesSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartiesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
