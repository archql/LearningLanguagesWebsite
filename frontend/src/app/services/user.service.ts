import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CulturalNote, DailyChallenge, UserProgress } from '../components/pages/dashboard-page/dashboard.model';
import { catchError, Observable, of, tap } from 'rxjs';
import { User } from '../components/pages/profile-page/user.model';
import { Topic } from '../components/teaching/lesson-selection/lesson-selection.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http : HttpClient) { }
  // Mock
  dailyChallenge: DailyChallenge = {
    isCompleted: false,
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
        console.log(error);
        return of(null);
      })
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.http.get<User>('/api/user/current').pipe(
      tap((response : User) => {
        return response;
      }), 
      catchError(error => {
        console.log(error);
        return of(null);
      })
    );
  }

  getUserProgress(): Observable<UserProgress | null> {
    return this.http.get<UserProgress>('/api/user/progress').pipe(
      tap((response : UserProgress) => {
        return response;
      }), 
      catchError(error => {
        console.log(error);
        return of(null);
      })
    );
  }

  getDailyChallenge(): Observable<DailyChallenge | null> {
    return this.http.get<DailyChallenge>('/api/user/daily-challenge').pipe(
      tap((response : DailyChallenge) => {
        return response;
      }), 
      catchError(error => {
        console.log(error);
        return of(null);
      })
    );
  }

  getUserTopics(): Observable<Topic[] | null> {
    return this.http.get<Topic[]>('/api/user/topics').pipe(
      tap((response : Topic[]) => {
        return response;
      }), 
      catchError(error => {
        console.log(error);
        return of(null);
      })
    );
  }

  changeLearningLanguage(language: string): Observable<boolean> {
    return this.http.post<boolean>("/api/user/language", { language }).pipe(
      tap(response => {
        return of(true);
      }), 
      catchError(error => {
        console.log(error);
        return of(false);
      })
    );
  }

  resetProgress(): Observable<boolean> {
    return this.http.post<boolean>("/api/user/reset", { }).pipe(
      tap(response => {
        return of(true);
      }), 
      catchError(error => {
        console.log(error);
        return of(false);
      })
    );
  }

  uploadVocabulary(file: File): Observable<boolean> {
    const formData = new FormData();
    formData.append('file', file);
    console.log(formData)

    return this.http.post<boolean>('/api/user/vocabulary', formData).pipe(
      tap(response => {
        return of(true);
      }),
      catchError(error => {
        console.log(error);
        return of(false);
      })
    );
  }

  // addWord(word: string, meaning: string): Observable<boolean> {
  //   return this.http.post<boolean>('/api/user/vocabulary/add', {word, meaning}).pipe(
  //     tap(response => {
  //       return of(true);
  //     }),
  //     catchError(error => {
  //       console.log(error);
  //       return of(false);
  //     })
  //   );
  // }
  // removeWord(word: string): Observable<boolean> {
  //   return this.http.post<boolean>('/api/user/vocabulary/remove', {word}).pipe(
  //     tap(response => {
  //       return of(true);
  //     }),
  //     catchError(error => {
  //       console.log(error);
  //       return of(false);
  //     })
  //   );
  // }

  // //getVocabulary()

  downloadVocabulary(): Observable<Blob | null> {
    return this.http.get('/api/user/vocabulary', { responseType: 'blob' }).pipe(
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
        console.log(error);
        return of(null);
      })
    );
  }
}
