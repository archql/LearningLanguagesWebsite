import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CulturalNote, DailyChallenge, UserProgress } from './dashboard.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { LessonSelectionComponent } from "../../teaching/lesson-selection/lesson-selection.component";
import { Topic } from '../../teaching/lesson-selection/lesson-selection.model';
import { LoaderWrapperComponent } from "../../helpers/loader-wrapper/loader-wrapper.component";
import { Loadable, loadableReady } from '../../helpers/loader-wrapper/loader-wrapper.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [MatCardModule, LoaderWrapperComponent, MatProgressBarModule, MatIconModule, MatButtonModule, TranslateModule, LessonSelectionComponent, LoaderWrapperComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  
  // Track whether the daily challenge is completed
  dailyChallenge : Loadable<DailyChallenge> = {loading: true};
  userProgress : Loadable<UserProgress> = {loading: true};
  culturalNote : Loadable<CulturalNote> = {loading: true};
  topics : Loadable<Topic[]> = {loading: true};

  // TODO
  // Get motivational message based on completed lessons
  getMotivationalMessage(): string {
    if (!loadableReady(this.userProgress)) return "";
    const progress = this.userProgress.data!.completedLessons 
      / this.userProgress.data!.totalLessons;
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
    if (!loadableReady(this.dailyChallenge)) return;
    // TODO call API
    this.dailyChallenge.data!.isCompleted = true;
    console.log('Daily challenge completed!');
  }
}
