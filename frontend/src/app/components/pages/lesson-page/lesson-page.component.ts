import { Component, HostListener } from '@angular/core';
import { MenuAction } from '../../helpers/menu-bar/menu-bar.model';
import { CanComponentDeactivate } from '../../../guards/can-deactivate.guard';
import { ContextMenuComponent } from '../../helpers/context-menu/context-menu.component';
import { MultipleChoiceComponent } from '../../exercises/multiple-choice/multiple-choice.component';
import { FillBlanksComponent } from '../../exercises/fill-blanks/fill-blanks.component';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';




interface Lesson {
  topic: string,
  vocabulary_list: string[],
  introduction: string,
  presentation: string,
  practice: Object[],
  conclusion: string
}
interface Exercise {
  type : string,
  data : string[]
}

@Component({
  selector: 'app-lesson-page',
  standalone: true,
  imports: [ContextMenuComponent, MultipleChoiceComponent, FillBlanksComponent, MatCardModule, CommonModule],
  templateUrl: './lesson-page.component.html',
  styleUrl: './lesson-page.component.scss'
})
export class LessonPageComponent implements CanComponentDeactivate {
  mcRange: number[] = []
  mcQuestions: string[] = []
  mcOptions: string[][] = []
  mcCorrectAnswers: string[] = []
  fbRange: number[] = []
  fbBeforeBlank: string[] = []
  fbAfterBlank: string[] = []
  fbCorrectAnswers: string[] = []

  // question = 'How do you feel?'
  // options = ['good', 'fine', 'great']

  // beforeBlank = 'Are you '
  // fbcorrectAnswer = 'talking'
  // afterBlank = ' to me?'
  lesson: Lesson = {'topic': '', 'vocabulary_list': [''], 'introduction': '', 'presentation': '', 'conclusion': '',
    'practice': []
  }

  handleMcAnswerSubmission(val: string, id: Number) {
    console.log('Mc Answer', val, id)
  }
  handleFbAnswerSubmission(val: string, id: Number) {
    console.log('Fb Answer', val, id)
  }

  // handleAnswerSubmission(val: string) {
  //   console.log(val)
  // }

  // handlefbAnswerSubmission(val: string) {
  //   console.log(val)
  // }

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
        let exercises: Exercise[] = data.practice
        let fillblanks = 0
        let multiplechoices = 0
        for (let i = 0; i < exercises.length; i++) {
          if (exercises[i].type === 'fill_blank') {
            fillblanks += 1
            this.fbBeforeBlank.push(exercises[i].data[0])
            this.fbAfterBlank.push(exercises[i].data[1])
            this.fbCorrectAnswers.push(exercises[i].data[2])
          }
          if (exercises[i].type === 'multiple_choice') {
            multiplechoices += 1
            this.mcQuestions.push(exercises[i].data[0])
            this.mcCorrectAnswers.push(exercises[i].data[1])
            this.mcOptions.push(exercises[i].data.slice(2))
          }
        }

        this.mcRange = Array(multiplechoices).fill(0).map((_, index) => index)
        this.fbRange = Array(fillblanks).fill(0).map((_, index) => index)
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
