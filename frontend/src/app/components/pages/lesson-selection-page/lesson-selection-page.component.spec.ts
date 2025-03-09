import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { LessonSelectionComponent } from '../../teaching/lesson-selection/lesson-selection.component';

import { LessonSelectionPageComponent } from './lesson-selection-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LessonSelectionPageComponent', () => {
  let component: LessonSelectionPageComponent;
  let fixture: ComponentFixture<LessonSelectionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LessonSelectionPageComponent,
        TranslateModule.forRoot(),
        MatCardModule,
        LessonSelectionComponent,
        BrowserAnimationsModule
      ],
      providers: [
        TranslateService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonSelectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
