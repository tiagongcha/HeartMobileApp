import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamInfoPage } from './team-info.page';

describe('TeamInfoPage', () => {
  let component: TeamInfoPage;
  let fixture: ComponentFixture<TeamInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
