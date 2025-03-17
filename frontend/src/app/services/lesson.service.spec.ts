import { TestBed } from '@angular/core/testing';
import { LessonService } from './lesson.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Topic } from '../components/teaching/lesson-selection/lesson-selection.model';
import { ExerciseBe } from '../components/exercises/exercise/exercise.model';
import { Lesson } from './lesson.service';


describe('LessonService', () => {
  let service: LessonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LessonService]
    });

    service = TestBed.inject(LessonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve topics via GET', () => {
    const mockTopics: Topic[] = [
      { title: 'Topic 1', lessons: [], completionPercentage: 0 },
      { title: 'Topic 2', lessons: [], completionPercentage: 50 }
    ];

    service.getTopics().subscribe(topics => {
      expect(topics).toEqual(mockTopics);
    });

    const req = httpMock.expectOne('/api/topics');
    expect(req.request.method).toBe('GET');
    req.flush(mockTopics);
  });

  it('should add a word via POST', () => {
    const word = 'test';
    const language = 'en';

    service.addWord(word, language).subscribe(response => {
      expect(response).toBeTrue();
    });

    const req = httpMock.expectOne('/api/user/vocabulary/add');
    expect(req.request.method).toBe('POST');
    req.flush(true);
  });

  it('should submit a lesson via POST', () => {
    const lessonId = 1;
    const score = true;
    const gameScore = 10;

    service.submitLesson(lessonId, score, gameScore).subscribe(response => {
      expect(response).toBeTrue();
    });

    const req = httpMock.expectOne('/api/user/progress/submit');
    expect(req.request.method).toBe('POST');
    req.flush(true);
  });

  it('should load a lesson via GET', () => {
    const lessonId = 1;
    const mockLesson: Lesson = {
      topic: 'Test Topic',
      vocabulary_list: [],
      introduction: '',
      presentation: '',
      practice: [],
      conclusion: '',
      language: 'en'
    };

    service.loadLesson(lessonId).subscribe(lesson => {
      expect(lesson).toEqual(mockLesson);
    });

    const req = httpMock.expectOne(`/api/lesson/${lessonId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLesson);
  });

  it('should load exercises via GET', () => {
    const exerciseId = 1;
    const mockExercise: ExerciseBe = {
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
    };

    service.loadExercises(exerciseId).subscribe(exercise => {
      expect(exercise).toEqual(mockExercise);
    });

    const req = httpMock.expectOne(`/api/exercises/${exerciseId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockExercise);
  });
});
