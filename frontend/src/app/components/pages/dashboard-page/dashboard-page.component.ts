import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CulturalNote, UserProgress } from './dashboard.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [MatCardModule, MatProgressBarModule, MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  // Mock data for user progress
  userProgress: UserProgress = {
    completedLessons: 7,
    totalLessons: 20,
  };
  // Track whether the daily challenge is completed
  isDailyChallengeCompleted: boolean = false;

  // Mock data for cultural notes
  culturalNotes: CulturalNote[] = [
    {
      id: 1,
      quote: 'The only limit to our realization of tomorrow is our doubts of today.',
      author: 'Franklin D. Roosevelt',
    },
    {
      id: 2,
      quote: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
      author: 'Winston Churchill',
    },
    {
      id: 3,
      quote: 'The best way to predict the future is to create it.',
      author: 'Peter Drucker',
    },
  ];

  // Get a random cultural note
  getRandomCulturalNote(): CulturalNote {
    const randomIndex = Math.floor(Math.random() * this.culturalNotes.length);
    return this.culturalNotes[randomIndex];
  }

  // Get motivational message based on completed lessons
  getMotivationalMessage(): string {
    const progress = this.userProgress.completedLessons / this.userProgress.totalLessons;
    if (progress < 0.25) {
      return 'Keep going! Every lesson brings you closer to your goal.';
    } else if (progress < 0.5) {
      return 'You’re making great progress! Keep it up!';
    } else if (progress < 0.75) {
      return 'You’re more than halfway there! Keep pushing!';
    } else {
      return 'You’re almost there! Finish strong!';
    }
  }
  // Handle daily challenge completion
  completeDailyChallenge(): void {
    this.isDailyChallengeCompleted = true;
    console.log('Daily challenge completed!');
    // Add logic to save the challenge completion state (e.g., to a backend or local storage)
  }
}
