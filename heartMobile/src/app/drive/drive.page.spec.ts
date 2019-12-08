import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivePage } from './drive.page';

describe('DrivePage', () => {
  let component: DrivePage;
  let fixture: ComponentFixture<DrivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrivePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
