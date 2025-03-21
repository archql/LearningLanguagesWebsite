import { Injectable } from '@angular/core';
import { Topic } from '../components/teaching/lesson-selection/lesson-selection.model';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { ExerciseBe } from '../components/exercises/exercise/exercise.model';

export interface Lesson {
  topic: string,
  vocabulary_list: string[],
  introduction: string,
  presentation: string,
  practice: Exercise[],
  conclusion: string,
  language: string
}
export interface Exercise {
  type : string,
  data : string[]
}


@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private http: HttpClient) { }

  isDoingLesson(): boolean {
    // TODO
    return true;
  } 

  getTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>('/api/topics').pipe(
      tap(response => {
        return response;
      }), 
      catchError(error => {
        // return of(null); TODO substitute?
        return throwError(() => error);
      })
    );
  }

  addWord(word: string, language: string): Observable<boolean> {
    return this.http.post<boolean>('/api/user/vocabulary/add', {word, language}).pipe(
      tap(response => {
        return of(true);
      }),
      catchError(error => {
        // return of(null); TODO substitute?
        return throwError(() => error);
      })
    );
  }

  submitLesson(lessonId: number, score: boolean, game_score: number): Observable<boolean> {
    console.log('test')
    return this.http.post<boolean>('/api/user/progress/submit', {lessonId, score, game_score}).pipe(
      tap(response => {
        return of(true);
      }),
      catchError(error => {
        // return of(null); TODO substitute?
        return throwError(() => error);
      })
    );
  }

  loadLesson(id: number): Observable<Lesson> {
    // return this.http.get<Lesson>(`/lesson_${id}.json`).pipe(
    return this.http.get<Lesson>(`/api/lesson/${id}`).pipe(
      tap(response => {
        return response;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  loadExercises(id: number): Observable<ExerciseBe> {
    return this.http.get<ExerciseBe>(`/api/exercises/${id}`).pipe(
      tap(response => {
        return response;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}
