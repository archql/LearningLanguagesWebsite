import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { LessonSelectionComponent } from '../../teaching/lesson-selection/lesson-selection.component';

import { LessonSelectionPageComponent } from './lesson-selection-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
      providers: [TranslateService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonSelectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the lesson selection component', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-lesson-selection')).not.toBeNull();
  });
});
