import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Tab2Page } from './uploader.page';

describe('UploaderPage', () => {
  let component: UploaderPage;
  let fixture: ComponentFixture<UploaderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploaderPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UploaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
