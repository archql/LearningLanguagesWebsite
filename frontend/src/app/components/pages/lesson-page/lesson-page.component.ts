import { Component, HostListener } from '@angular/core';
import { MenuAction } from '../../helpers/menu-bar/menu-bar.model';
import { CanComponentDeactivate } from '../../../guards/can-deactivate.guard';
import { ContextMenuComponent } from '../../helpers/context-menu/context-menu.component';
import { MultipleChoiceComponent } from '../../exercises/multiple-choice/multiple-choice.component';
import { FillBlanksComponent } from '../../exercises/fill-blanks/fill-blanks.component';
import { HttpClient } from '@angular/common/http';


interface Lesson {
  topic: string,
  vocabulary_list: string[],
  introduction: string,
  presentation: string,
  practice: Object[],
  conclusion: string
}

@Component({
  selector: 'app-lesson-page',
  standalone: true,
  imports: [ContextMenuComponent, MultipleChoiceComponent, FillBlanksComponent],
  templateUrl: './lesson-page.component.html',
  styleUrl: './lesson-page.component.scss'
})
export class LessonPageComponent implements CanComponentDeactivate {
  question = 'How do you feel?'
  options = ['good', 'fine', 'great']
  sentence = 'What do you want from me?'
  correctAnswer = 'Money'
  beforeBlank = 'Are you '
  fbcorrectAnswer = 'talking'
  afterBlank = ' to me?'
  lesson: Lesson = {'topic': '', 'vocabulary_list': [''], 'introduction': '', 'presentation': '', 'conclusion': '',
    'practice': []
  }

  handleAnswerSubmission(val: string) {
    console.log(val)
  }

  handlefbAnswerSubmission(val: string) {
    console.log(val)
  }

  constructor(private http: HttpClient) {}

  menuItems: MenuAction[] = [
    {
      trID: 'add-to-vocabulary',
      label: '',
      action: (e) => { console.log(e) }
    }
  ]

  canDeactivate(): boolean {
    // save state here
    return confirm('You have unsaved changes. Leave anyway?');
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
    return '';
  }

  @HostListener('window:unload', ['$event'])
  onUnload(event: Event): void {
    // save state here
  }

  loadLesson() {
    this.http.get<any>('/lesson_1.json').subscribe(
      (data) => {
        this.lesson = data;
        console.log('Questions loaded:', this.lesson);
      },
      (error) => {
        console.error('Failed to load questions', error);
      }
    );
  }

  ngOnInit() {
    this.loadLesson()
  }
}
