import { Component } from '@angular/core';
import { LessonSelectionComponent } from '../../teaching/lesson-selection/lesson-selection.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LessonService } from '../../../services/lesson.service';
import { Topic } from '../../teaching/lesson-selection/lesson-selection.model';
import { LessonServiceMock } from '../../../services/mock/lesson.service.mock';

@Component({
  selector: 'app-lesson-selection-page',
  standalone: true,
  imports: [LessonSelectionComponent, TranslateModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './lesson-selection-page.component.html',
  styleUrl: './lesson-selection-page.component.scss'
})
export class LessonSelectionPageComponent {
  topics: Topic [] = [];
  loading: boolean = true;
  error: boolean = false;

  constructor(private lessonService: LessonServiceMock) {}

  ngOnInit() {
    this.lessonService.getTopics().subscribe((data: any[]) => {
      this.topics = data;
      this.loading = false;
      this.error = this.topics.length === 0;
    });
  }
}
