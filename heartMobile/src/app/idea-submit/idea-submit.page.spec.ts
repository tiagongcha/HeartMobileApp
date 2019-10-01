import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaSubmitPage } from './idea-submit.page';

describe('IdeaSubmitPage', () => {
  let component: IdeaSubmitPage;
  let fixture: ComponentFixture<IdeaSubmitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdeaSubmitPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdeaSubmitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
