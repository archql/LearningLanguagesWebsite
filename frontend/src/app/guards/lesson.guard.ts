import { CanActivateFn, Router } from '@angular/router';
import { LessonService } from '../services/lesson.service';
import { inject } from '@angular/core';

export const lessonGuard: CanActivateFn = (route, state) => {
  const lessonService = inject(LessonService);

  return lessonService.isDoingLesson();
};
