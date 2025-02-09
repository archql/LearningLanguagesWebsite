import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { LessonSelectionComponent } from '../../teaching/lesson-selection/lesson-selection.component';

import { LessonSelectionPageComponent } from './lesson-selection-page.component';

describe('LessonSelectionPageComponent', () => {
  let component: LessonSelectionPageComponent;
  let fixture: ComponentFixture<LessonSelectionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LessonSelectionPageComponent,
        TranslateModule.forRoot(),
        MatCardModule,
        LessonSelectionComponent
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

  it('should display the translated title', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    translateService.setTranslation('en', { 'app.lesson-selection-title': 'Lesson Selection' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('mat-card-title').textContent).toContain('Lesson Selection');
  });

  it('should contain the lesson selection component', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-lesson-selection')).not.toBeNull();
  });
});
