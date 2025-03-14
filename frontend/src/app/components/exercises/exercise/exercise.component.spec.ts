// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { ExerciseComponent } from './exercise.component';

// describe('ExerciseComponent', () => {
//   let component: ExerciseComponent;
//   let fixture: ComponentFixture<ExerciseComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [ExerciseComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(ExerciseComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseComponent } from './exercise.component';
import { LessonService } from '../../../services/lesson.service';
import { of } from 'rxjs';
import { EventEmitter } from '@angular/core';

class MockLessonService {
  loadLesson(filename: string) {
    return of({
      practice: [
        { type: 'fill_blank', data: ['The capital of France is', '.', 'Paris'] },
        { type: 'multiple_choice', data: ['What is 2 + 2?', '4', '3', '4', '5'] }
      ]
    });
  }
}

describe('ExerciseComponent', () => {
  let component: ExerciseComponent;
  let fixture: ComponentFixture<ExerciseComponent>;
  let lessonService: LessonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseComponent],
      providers: [
        { provide: LessonService, useClass: MockLessonService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseComponent);
    component = fixture.componentInstance;
    lessonService = TestBed.inject(LessonService);

    component.lessonFilename = 'lesson_1.json';
    component.triggerFinish = new EventEmitter<void>();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load exercises on initialization', () => {
    component.ngOnInit();

    expect(component.fbRange.length).toBe(1);
    expect(component.mcRange.length).toBe(1);
  });

  it('should handle multiple-choice answer submission', () => {
    component.handleMcAnswerSubmission('4', 0);
    expect(component.mcGivenAnswers[0]).toBe('4');
  });

  it('should handle fill-in-the-blank answer submission', () => {
    component.handleFbAnswerSubmission('Paris', 0);
    expect(component.fbGivenAnswers[0]).toBe('Paris');
  });

  it('should validate answers correctly', () => {
    component.handleFbAnswerSubmission('Paris', 0);
    component.handleMcAnswerSubmission('4', 0);
    component.validateAnswers();

    expect(component.feedbackData[0]).toContain('Answered 2 out of 2 correctly');
  });

  it('should emit feedback data when triggerFinish is triggered', () => {
    spyOn(component.returnFeedback, 'emit');

    component.triggerFinish.emit();

    expect(component.returnFeedback.emit).toHaveBeenCalled();
  });
});
