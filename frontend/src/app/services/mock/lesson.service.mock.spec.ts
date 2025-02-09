import { TestBed } from '@angular/core/testing';
import { LessonServiceMock } from './lesson.service.mock';
import { Topic } from '../../components/teaching/lesson-selection/lesson-selection.model';
import { take } from 'rxjs/operators';

describe('LessonServiceMock', () => {
  let service: LessonServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonServiceMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of topics', (done) => {
    service.getTopics().pipe(take(1)).subscribe((topics: Topic[]) => {
      expect(topics.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should calculate completion percentage correctly', (done) => {
    service.getTopics().pipe(take(1)).subscribe((topics: Topic[]) => {
      topics.forEach(topic => {
        const completedLessons = topic.lessons.filter(lesson => lesson.completed).length;
        const expectedPercentage = (completedLessons / topic.lessons.length) * 100;
        expect(topic.completionPercentage).toBe(expectedPercentage);
      });
      done();
    });
  });
});
