import { Component } from '@angular/core';
import { LessonSelectionComponent } from '../../teaching/lesson-selection/lesson-selection.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-lesson-selection-page',
  standalone: true,
  imports: [LessonSelectionComponent, TranslateModule, MatCardModule],
  templateUrl: './lesson-selection-page.component.html',
  styleUrl: './lesson-selection-page.component.scss'
})
export class LessonSelectionPageComponent {

}
