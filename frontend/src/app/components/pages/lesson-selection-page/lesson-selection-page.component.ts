import { Component } from '@angular/core';
import { LessonSelectionComponent } from '../../teaching/lesson-selection/lesson-selection.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-lesson-selection-page',
  standalone: true,
  imports: [LessonSelectionComponent, TranslateModule],
  templateUrl: './lesson-selection-page.component.html',
  styleUrl: './lesson-selection-page.component.scss'
})
export class LessonSelectionPageComponent {

}
