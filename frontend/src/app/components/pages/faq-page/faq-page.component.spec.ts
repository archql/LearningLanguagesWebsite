import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqPageComponent } from './faq-page.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('FaqPageComponent', () => {
  let component: FaqPageComponent;
  let fixture: ComponentFixture<FaqPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FaqPageComponent,
        TranslateModule.forRoot(),
      ], 
      providers: [
        TranslateService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
