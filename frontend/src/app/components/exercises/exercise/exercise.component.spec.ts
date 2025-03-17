import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseComponent } from './exercise.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { LessonService } from '../../../services/lesson.service';
import { FloatingProgressMeterComponent } from '../../helpers/floating-progress-meter/floating-progress-meter.component';
import { ExerciseBe } from './exercise.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExerciseComponent', () => {
  let component: ExerciseComponent;
  let fixture: ComponentFixture<ExerciseComponent>;
  let lessonServiceSpy: jasmine.SpyObj<LessonService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;
  
  beforeEach(async () => {
    lessonServiceSpy = jasmine.createSpyObj('LessonService', ['loadExercises', 'submitLesson']);
    lessonServiceSpy.loadExercises.and.returnValue(of({
      mcRange: [],
      fbRange: [],
      mcGivenAnswers: [],
      fbGivenAnswers: [],
      mcQuestions: [],
      mcOptions: [],
      mcCorrectAnswers: [],
      fbBeforeBlank: [],
      fbAfterBlank: [],
      fbCorrectAnswers: []
    } as ExerciseBe));

    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ExerciseComponent,
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        { provide: LessonService, useValue: lessonServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: () => '1' }) } },
        TranslateService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize progress tracking on first answer submission', () => {
    component.exerciseBe.data = {
      mcRange: [0, 1],
      fbRange: [0],
      mcGivenAnswers: ['null', 'null'],
      fbGivenAnswers: ['null'],
      mcCorrectAnswers: ['A', 'B'],
      fbCorrectAnswers: ['answer'],
      mcQuestions: ['Question 1', 'Question 2'],
      fbBeforeBlank: ['Fill this: '],
      fbAfterBlank: ['.'],
    } as any;

    component.handleMcAnswerSubmission('A', 0);

    expect(component.ptInit).toBeTrue();
    expect(component.ptAnswered).toBe(1);
  });

  it('should show notification on successful lesson submission', () => {
    lessonServiceSpy.submitLesson.and.returnValue(of(true));
    component.exerciseBe.data = { mcRange: [], fbRange: [] } as any;
    component.validateAnswers();

    expect(snackBarSpy.open).toHaveBeenCalled();
  });
});