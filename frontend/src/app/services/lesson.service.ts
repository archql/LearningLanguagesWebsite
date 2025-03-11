import { Injectable } from '@angular/core';
import { Topic } from '../components/teaching/lesson-selection/lesson-selection.model';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

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

  addWord(word: string): Observable<boolean> {
    return this.http.post<boolean>('/api/user/vocabulary/add', {word}).pipe(
      tap(response => {
        return of(true);
      }),
      catchError(error => {
        // return of(null); TODO substitute?
        return throwError(() => error);
      })
    );
  }
}
