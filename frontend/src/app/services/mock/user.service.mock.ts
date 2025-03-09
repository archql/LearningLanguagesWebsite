import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CulturalNote, DailyChallenge, UserProgress } from '../../components/pages/dashboard-page/dashboard.model';
import { User } from '../../components/pages/profile-page/user.model';
import { Topic } from '../../components/teaching/lesson-selection/lesson-selection.model';

@Injectable({
  providedIn: 'root'
})
export class UserServiceMock {

  private dailyChallenge: DailyChallenge = {
    isCompleted: false,
  };
  private userProgress: UserProgress = {
    completedLessons: 7,
    totalLessons: 20,
  };
  private topics: Topic[] = [];
  private culturalNote: CulturalNote = {
    quote: 'The only limit to our realization of tomorrow is our doubts of today.',
    author: 'Franklin D. Roosevelt',
  };
  private user: User = {
    id: 1,
    login: 'JohnDoe',
    email: 'johndoe@example.com',
    language: 'en',
  };

  getCulturalNote(): Observable<CulturalNote | null> {
    return of(this.culturalNote);
  }

  getCurrentUser(): Observable<User | null> {
    return of(this.user);
  }

  getUserProgress(): Observable<UserProgress | null> {
    return of(this.userProgress);
  }

  getDailyChallenge(): Observable<DailyChallenge | null> {
    return of(this.dailyChallenge);
  }

  getUserTopics(): Observable<Topic[] | null> {
    return of(this.topics);
  }

  changeLearningLanguage(language: string): Observable<boolean> {
    this.user.language = language;
    return of(true);
  }

  resetProgress(): Observable<boolean> {
    this.userProgress = { completedLessons: 10, totalLessons: 20 };
    return of(true);
  }

  uploadVocabulary(file: File): Observable<boolean> {
    console.log('Mock upload vocabulary:', file);
    return of(true);
  }

  downloadVocabulary(): Observable<Blob | null> {
    const blob = new Blob(['mock vocabulary content'], { type: 'text/yaml' });
    return of(blob);
  }
}
