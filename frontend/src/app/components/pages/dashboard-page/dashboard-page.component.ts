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
import { Loadable } from '../../helpers/loader-wrapper/loader-wrapper.model';
import { UserService } from '../../../services/user.service';
import { UserServiceMock } from '../../../services/mock/user.service.mock';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [MatCardModule, LoaderWrapperComponent, MatProgressBarModule, MatIconModule, MatButtonModule, TranslateModule, LessonSelectionComponent, LoaderWrapperComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  
  // avoid typescript error - assign empty loadable
  dailyChallenge : Loadable<DailyChallenge> = new Loadable;
  userProgress : Loadable<UserProgress> = new Loadable;
  culturalNote : Loadable<CulturalNote> = new Loadable;
  topics : Loadable<Topic[]> = new Loadable;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dailyChallenge = new Loadable(() => this.userService.getDailyChallenge());
    this.culturalNote = new Loadable(() => this.userService.getCulturalNote());
    this.userProgress = new Loadable(() => this.userService.getUserProgress());
    this.topics = new Loadable(() => this.userService.getUserTopics());
  }

  ngOnDestroy() {
    this.dailyChallenge.cleanup();
    this.culturalNote.cleanup();
    this.userProgress.cleanup();
    this.topics.cleanup();
  }

  // TODO
  // Get motivational message based on completed lessons
  getMotivationalMessage(): string {
    if (!this.userProgress.ready()) return "";
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
    if (!this.dailyChallenge.ready()) return;
    // TODO call API (?)
    this.router.navigate([`/home/lesson/${this.dailyChallenge.data?.id}`]);
  }
}
