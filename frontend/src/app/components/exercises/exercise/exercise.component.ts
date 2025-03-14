import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LessonService, Exercise } from '../../../services/lesson.service';
import { MultipleChoiceComponent } from '../../exercises/multiple-choice/multiple-choice.component';
import { FillBlanksComponent } from '../../exercises/fill-blanks/fill-blanks.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [MultipleChoiceComponent, FillBlanksComponent, CommonModule],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.scss'
})
export class ExerciseComponent {
  @Input() lessonFilename: string = ''
  mcRange: number[] = []
  mcQuestions: string[] = []
  mcOptions: string[][] = []
  mcCorrectAnswers: string[] = []
  fbRange: number[] = []
  fbBeforeBlank: string[] = []
  fbAfterBlank: string[] = []
  fbCorrectAnswers: string[] = []
  mcGivenAnswers: string[] = []
  fbGivenAnswers: string[] = []

  @Input() triggerFinish = new EventEmitter<void>;
  @Output() returnFeedback = new EventEmitter<string[]> 
  feedbackData: string[] = ['', '']

  handleMcAnswerSubmission(val: string, id: number) {
    this.mcGivenAnswers[id] = val
  }
  handleFbAnswerSubmission(val: string, id: number) {
    this.fbGivenAnswers[id] = val
  }
  validateAnswers() {
    let notAnsweredfb = 0
    let correct = 0
    let notAnsweredmc = 0
    let feedback = ''
    for (let i = 0; i < this.fbRange.length; i++) {
      feedback += `<strong>Question:</strong> ${this.fbBeforeBlank[i]} ___ ${this.fbAfterBlank[i]}`
      if (this.fbGivenAnswers[i] === this.fbCorrectAnswers[i]) {
        correct += 1
        feedback += `<br>Your answer "${this.fbGivenAnswers[i]}" is correct`
      }
      else if (this.fbGivenAnswers[i] === 'null') { 
        notAnsweredfb += 1 
        feedback += `<br>You didn't answer this question`
      }
      else {
        feedback += `<br>Your answer "${this.fbGivenAnswers[i]}" is wrong`
      }
      feedback += `<br>`
    }
    for (let i = 0; i < this.mcRange.length; i++) {
      feedback += `<strong>Question:</strong> ${this.mcQuestions[i]} Options ${this.mcOptions[i]}`
      if (this.mcGivenAnswers[i] === this.mcCorrectAnswers[i]) {
        correct += 1
        feedback += `<br>Your answer "${this.mcGivenAnswers[i]}" is correct`
      }
      else if (this.mcGivenAnswers[i] === 'null') { 
        notAnsweredmc += 1
        feedback += `<br> You didn't answer this question`
      }
      else {
        feedback += `<br>Your answer "${this.mcGivenAnswers[i]}" is wrong`
      }
      feedback += `<br>`
    }

    this.feedbackData[0] = `Answered ${correct} out of ${this.fbRange.length + this.mcRange.length} correctly`
    this.feedbackData[1] = feedback
  }

  constructor(private lessonService: LessonService) {}

  loadExercises() {
    this.lessonService.loadLesson(this.lessonFilename).subscribe(
      (data) => {
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
        this.mcGivenAnswers = Array(multiplechoices).fill('null')
        this.fbGivenAnswers = Array(fillblanks).fill('null')
      },
      (error) => {
        console.error('Failed to load questions', error);
      }
    );
  }

  ngOnInit() {
    this.loadExercises()
    if (this.triggerFinish) {
      this.triggerFinish.subscribe(() => {
        this.validateAnswers()
        this.returnFeedback.emit(this.feedbackData)
      });
    }
  }
}
