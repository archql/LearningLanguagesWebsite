import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { LessonService, Exercise, Lesson } from '../../../services/lesson.service';
import { MultipleChoiceComponent } from '../../exercises/multiple-choice/multiple-choice.component';
import { FillBlanksComponent } from '../../exercises/fill-blanks/fill-blanks.component';
import { CommonModule } from '@angular/common';
import { LoaderWrapperComponent } from "../../helpers/loader-wrapper/loader-wrapper.component";
import { Loadable } from '../../helpers/loader-wrapper/loader-wrapper.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ExerciseBe } from './exercise.model';



@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [MultipleChoiceComponent, FillBlanksComponent, CommonModule, LoaderWrapperComponent],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.scss'
})
export class ExerciseComponent {
  exerciseBe: Loadable<ExerciseBe> = new Loadable
  private readonly route = inject(ActivatedRoute);
  @Input() id: number = 0


  @Input() triggerFinish = new EventEmitter<void>;
  @Output() returnFeedback = new EventEmitter<string[]> 
  feedbackData: string[] = ['', '']

  handleMcAnswerSubmission(val: string, id: number) {
    this.exerciseBe.data!.mcGivenAnswers[id] = val
  }
  handleFbAnswerSubmission(val: string, id: number) {
    this.exerciseBe.data!.fbGivenAnswers[id] = val
  }
  validateAnswers() {
    let notAnsweredfb = 0
    let correct = 0
    let notAnsweredmc = 0
    let feedback = ''
    for (let i = 0; i < this.exerciseBe.data!.fbRange.length; i++) {
      feedback += `<strong>Question:</strong> ${this.exerciseBe.data!.fbBeforeBlank[i]} ___ ${this.exerciseBe.data!.fbAfterBlank[i]}`
      if (this.exerciseBe.data!.fbGivenAnswers[i] === this.exerciseBe.data!.fbCorrectAnswers[i]) {
        correct += 1
        feedback += `<br>Your answer "${this.exerciseBe.data!.fbGivenAnswers[i]}" is correct`
      }
      else if (this.exerciseBe.data!.fbGivenAnswers[i] === 'null') { 
        notAnsweredfb += 1 
        feedback += `<br>You didn't answer this question`
      }
      else {
        feedback += `<br>Your answer "${this.exerciseBe.data!.fbGivenAnswers[i]}" is wrong`
      }
      feedback += `<br>`
    }
    for (let i = 0; i < this.exerciseBe.data!.mcRange.length; i++) {
      feedback += `<strong>Question:</strong> ${this.exerciseBe.data!.mcQuestions[i]} Options ${this.exerciseBe.data!.mcOptions[i]}`
      if (this.exerciseBe.data!.mcGivenAnswers[i] === this.exerciseBe.data!.mcCorrectAnswers[i]) {
        correct += 1
        feedback += `<br>Your answer "${this.exerciseBe.data!.mcGivenAnswers[i]}" is correct`
      }
      else if (this.exerciseBe.data!.mcGivenAnswers[i] === 'null') { 
        notAnsweredmc += 1
        feedback += `<br> You didn't answer this question`
      }
      else {
        feedback += `<br>Your answer "${this.exerciseBe.data!.mcGivenAnswers[i]}" is wrong`
      }
      feedback += `<br>`
    }

    this.feedbackData[0] = `Answered ${correct} out of ${this.exerciseBe.data!.fbRange.length + this.exerciseBe.data!.mcRange.length} correctly`
    this.feedbackData[1] = feedback

    this.lessonService.submitLesson(this.id, (correct / (this.exerciseBe.data!.mcRange.length + this.exerciseBe.data!.fbRange.length)) > 0.5).subscribe({
      next: (response) => {
        this.showNotification(this.tr['app.dialog.add-word.success']);
        this.addWordPending = false;
      },
      error: (error) => {
        console.error('Login failed', error);
        this.showNotification(this.tr['app.dialog.add-word.failure']);
        this.addWordPending = false;
      }
    });
  }

  constructor(private lessonService: LessonService, private router: Router) {}

  // loadExercises() {
  //   if (!this.lessonDb.ready()) return;
  //   const data = JSON.parse(this.lessonDb.data!) as Lesson
  //   const practiceData = data.practice

  //   let exercises: Exercise[] = practiceData
  //   let fillblanks = 0
  //   let multiplechoices = 0
  //   for (let i = 0; i < exercises.length; i++) {
  //     if (exercises[i].type === 'fill_blank') {
  //       fillblanks += 1
  //       this.fbBeforeBlank.push(exercises[i].data[0])
  //       this.fbAfterBlank.push(exercises[i].data[1])
  //       this.fbCorrectAnswers.push(exercises[i].data[2])
  //     }
  //     if (exercises[i].type === 'multiple_choice') {
  //       multiplechoices += 1
  //       this.mcQuestions.push(exercises[i].data[0])
  //       this.mcCorrectAnswers.push(exercises[i].data[1])
  //       this.mcOptions.push(exercises[i].data.slice(2))
  //     }
  //   }

  //   this.mcRange = Array(multiplechoices).fill(0).map((_, index) => index)
  //   this.fbRange = Array(fillblanks).fill(0).map((_, index) => index)
  //   this.mcGivenAnswers = Array(multiplechoices).fill('null')
  //   this.fbGivenAnswers = Array(fillblanks).fill('null')
  // }

  ngOnInit() {
    this.exerciseBe = new Loadable(() => this.lessonService.loadExercises(this.id));

    if (this.triggerFinish) {
      this.triggerFinish.subscribe(() => {
        this.validateAnswers()
        this.returnFeedback.emit(this.feedbackData)
      });
    }
  }
  ngOnDestroy() {
    this.exerciseBe.cleanup()
  }
  showNotification(message: string) {
    this.snackBar.open(message, this.tr['app.dialog.close'], {
      duration: 3000, // Notification will auto-close after 3 seconds
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}


