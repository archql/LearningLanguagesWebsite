import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CulturalNote, DailyChallenge, UserProgress } from '../components/pages/dashboard-page/dashboard.model';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../components/pages/profile-page/user.model';
import { Topic } from '../components/teaching/lesson-selection/lesson-selection.model';
import { VocabularyGroup, VocabularyWord } from '../components/pages/vocabulary-page/vocabulary.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http : HttpClient) { }
  // Mock
  dailyChallenge: DailyChallenge = {
    isCompleted: false,
    id: 1
  };
  userProgress: UserProgress = {
    completedLessons: 7,
    totalLessons: 20,
  };
  topics: Topic[] = [];
  culturalNote: CulturalNote = {
    quote: 'The only limit to our realization of tomorrow is our doubts of today.',
    author: 'Franklin D. Roosevelt',
  };
  user = {
    nickname: 'JohnDoe',
    email: 'johndoe@example.com',
    learningLanguage: { code: 'en', name: 'English', flagIcon: '🇺🇸' },
  };


  getCulturalNote(): Observable<CulturalNote | null> {
    return this.http.get<CulturalNote>('/api/user/cultural-note').pipe(
      tap((response : CulturalNote) => {
        return response;
      }), 
      catchError(error => {
        // return of(null); TODO substitute?
        return throwError(() => error);
      })
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.http.get<User>('/api/user/current').pipe(
      tap((response : User) => {
        return response;
      }), 
      catchError(error => {
        // return of(null); TODO substitute?
        return throwError(() => error);
      })
    );
  }

  getUserProgress(): Observable<UserProgress | null> {
    return this.http.get<UserProgress>('/api/user/progress').pipe(
      tap((response : UserProgress) => {
        return response;
      }), 
      catchError(error => {
        // return of(null); TODO substitute?
        return throwError(() => error);
      })
    );
  }

  getDailyChallenge(): Observable<DailyChallenge | null> {
    return this.http.get<DailyChallenge>('/api/user/daily-challenge').pipe(
      tap((response : DailyChallenge) => {
        return response;
      }), 
      catchError(error => {
        // return of(null); TODO substitute?
        return throwError(() => error);
      })
    );
  }

  getUserTopics(): Observable<Topic[] | null> {
    return this.http.get<Topic[]>('/api/user/topics').pipe(
      tap((response : Topic[]) => {
        return response;
      }), 
      catchError(error => {
        // return of(null); TODO substitute?
        return throwError(() => error);
      })
    );
  }

  changeLearningLanguage(language: string): Observable<boolean> {
    return this.http.post<boolean>("/api/user/language", { language }).pipe(
      tap(response => {
        return of(true);
      }), 
      catchError(error => {
        // return of(null); TODO substitute?
        return throwError(() => error);
      })
    );
  }

  resetProgress(): Observable<boolean> {
    return this.http.post<boolean>("/api/user/reset", { }).pipe(
      tap(response => {
        return of(true);
      }), 
      catchError(error => {
        // return of(null); TODO substitute?
        return throwError(() => error);
      })
    );
  }

  uploadVocabulary(file: File): Observable<boolean> {
    const formData = new FormData();
    formData.append('file', file);
    console.log(formData)

    return this.http.post<boolean>('/api/user/vocabulary/file', formData).pipe(
      tap(response => {
        return of(true);
      }),
      catchError(error => {
        // return of(null); TODO substitute?
        return throwError(() => error);
      })
    );
  }

  removeWord(word: VocabularyWord): Observable<boolean> {
    return this.http.delete<boolean>('/api/user/vocabulary', { params: { word: word.word, translation: word.meaning } }).pipe(
      tap(() => {
        return of(true);
      }),
      catchError(error => {
        // return of(null); TODO substitute?
        return throwError(() => error);
      })
    );
    // return this.http.post<boolean>('/api/user/vocabulary/remove', {word}).pipe(
    //   tap(response => {
    //     return of(true);
    //   }),
    //   catchError(error => {
    //     console.log(error);
    //     return of(false);
    //   })
    // );
  }

  getVocabulary(): Observable<VocabularyGroup[]> {
    return this.http.get<VocabularyGroup[]>('/api/user/vocabulary').pipe(
      tap((response : VocabularyGroup[]) => {
        return response;
      }), 
      catchError(error => {
        // return of(null); TODO substitute?
        return throwError(() => error);
      })
    );
  }

  downloadVocabulary(): Observable<Blob | null> {
    return this.http.get('/api/user/vocabulary/file', { responseType: 'blob' }).pipe(
      tap(response => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vocabulary.yaml'; // Adjust the file name as needed
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        return response;
      }),
      catchError(error => {
        // return of(null); TODO substitute?
        return throwError(() => error);
      })
    );
  }
}
