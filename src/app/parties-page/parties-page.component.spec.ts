import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartiesPageComponent } from './parties-page.component';

describe('PartiesPageComponent', () => {
  let component: PartiesPageComponent;
  let fixture: ComponentFixture<PartiesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartiesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
