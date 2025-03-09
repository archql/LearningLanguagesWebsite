import { Component } from '@angular/core';
import { LessonSelectionComponent } from '../../teaching/lesson-selection/lesson-selection.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { LessonService } from '../../../services/lesson.service';
import { Topic } from '../../teaching/lesson-selection/lesson-selection.model';
import { LessonServiceMock } from '../../../services/mock/lesson.service.mock';
import { LoaderWrapperComponent } from '../../helpers/loader-wrapper/loader-wrapper.component';
import { Loadable } from '../../helpers/loader-wrapper/loader-wrapper.model';

@Component({
  selector: 'app-lesson-selection-page',
  standalone: true,
  imports: [LessonSelectionComponent, TranslateModule, MatCardModule, LoaderWrapperComponent],
  templateUrl: './lesson-selection-page.component.html',
  styleUrl: './lesson-selection-page.component.scss'
})
export class LessonSelectionPageComponent {
  topics: Loadable<Topic[]> = new Loadable;

  constructor(private lessonService: LessonService) {}

  ngOnInit() {
    this.topics = new Loadable(()=>this.lessonService.getTopics());
  }

  ngOnDestroy() {
    this.topics.cleanup();
  }
}
