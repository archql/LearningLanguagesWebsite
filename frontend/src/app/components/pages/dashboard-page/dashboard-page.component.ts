import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { XpComponent } from "../../helpers/xp/xp.component";

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [MatCardModule, LoaderWrapperComponent, MatProgressBarModule, MatIconModule, MatButtonModule, TranslateModule, LessonSelectionComponent, LoaderWrapperComponent, XpComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  
  // avoid typescript error - assign empty loadable
  dailyChallenge : Loadable<DailyChallenge> = new Loadable;
  userProgress : Loadable<UserProgress> = new Loadable;
  culturalNote : Loadable<CulturalNote> = new Loadable;
  topics : Loadable<Topic[]> = new Loadable;
  xp : Loadable<number> = new Loadable;
  typewriterText: string = '';
  private typewriterInterval: any;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dailyChallenge = new Loadable(() => this.userService.getDailyChallenge());
    this.culturalNote = new Loadable(() => this.userService.getCulturalNote());
    this.userProgress = new Loadable(() => this.userService.getUserProgress());
    this.topics = new Loadable(() => this.userService.getUserTopics());
    this.xp = new Loadable(() => this.userService.getUserXP());
    this.startTypewriterEffect();
  }

  ngOnDestroy() {
    this.dailyChallenge.cleanup();
    this.culturalNote.cleanup();
    this.userProgress.cleanup();
    this.topics.cleanup();
    this.xp.cleanup();
    clearInterval(this.typewriterInterval);
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

  startTypewriterEffect() {
    const fullText = this.culturalNote.data?.quote || '';
    const words = fullText.split(' ');
    let currentIndex = 0;
    this.typewriterInterval = setInterval(() => {
      if (currentIndex < words.length) {
        this.typewriterText += (currentIndex === 0 ? '' : ' ') + words[currentIndex];
        currentIndex++;
      } else {
        clearInterval(this.typewriterInterval);
      }
    }, 100); // Adjust typing speed here
  }
}
