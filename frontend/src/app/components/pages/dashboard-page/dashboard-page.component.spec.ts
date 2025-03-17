import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPageComponent } from './dashboard-page.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardPageComponent,
        TranslateModule.forRoot(),
        BrowserAnimationsModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TranslateService,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the correct motivational message based on progress', () => {
    expect(component.getMotivationalMessage()).toBe('');

    component.userProgress.loading = false
    component.userProgress.data = { completedLessons: 0, totalLessons: 100 };
    expect(component.getMotivationalMessage()).toBe('app.dashboard.motivational.start');

    component.userProgress.data = { completedLessons: 10, totalLessons: 100 };
    expect(component.getMotivationalMessage()).toBe('app.dashboard.motivational.keepGoing');

    component.userProgress.data = { completedLessons: 30, totalLessons: 100 };
    expect(component.getMotivationalMessage()).toBe('app.dashboard.motivational.greatProgress');

    component.userProgress.data = { completedLessons: 50, totalLessons: 100 };
    expect(component.getMotivationalMessage()).toBe('app.dashboard.motivational.halfway');

    component.userProgress.data = { completedLessons: 75, totalLessons: 100 };
    expect(component.getMotivationalMessage()).toBe('app.dashboard.motivational.almostThere');

    component.userProgress.data = { completedLessons: 100, totalLessons: 100 };
    expect(component.getMotivationalMessage()).toBe('app.dashboard.motivational.completed');
  });

  it('should navigate to the daily challenge lesson on completion', () => {
    component.dailyChallenge.data = { id: 123, isCompleted: false };
    component.dailyChallenge.loading = false;
    component.completeDailyChallenge();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/home/lesson/123']);
  });

  it('should not navigate if daily challenge is not ready', () => {
    component.dailyChallenge.loading = true;
    component.completeDailyChallenge();
    expect(component['router'].navigate).not.toHaveBeenCalled();
  });

  it('should not navigate if daily challenge is already completed', () => {
    component.dailyChallenge.data = { id: 123, isCompleted: true };
    component.dailyChallenge.loading = false;
    component.completeDailyChallenge();
    expect(component['router'].navigate).not.toHaveBeenCalled();
  });

  it('should start the typewriter effect', () => {
    component.culturalNote.data = { quote: 'Test quote', author: 'Author' };
    component.startTypewriterEffect();
    expect(component.typewriterText).toBe('');
  });
});
