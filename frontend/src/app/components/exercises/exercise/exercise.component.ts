import { Component, Input, Output, EventEmitter, inject, ViewChild } from '@angular/core';
import { LessonService, Exercise, Lesson } from '../../../services/lesson.service';
import { MultipleChoiceComponent } from '../../exercises/multiple-choice/multiple-choice.component';
import { FillBlanksComponent } from '../../exercises/fill-blanks/fill-blanks.component';
import { CommonModule } from '@angular/common';
import { LoaderWrapperComponent } from "../../helpers/loader-wrapper/loader-wrapper.component";
import { Loadable } from '../../helpers/loader-wrapper/loader-wrapper.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ExerciseBe } from './exercise.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FloatingProgressMeterComponent } from '../../helpers/floating-progress-meter/floating-progress-meter.component';





@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [MultipleChoiceComponent, FillBlanksComponent, CommonModule, LoaderWrapperComponent, FloatingProgressMeterComponent],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.scss'
})
export class ExerciseComponent {
  exerciseBe: Loadable<ExerciseBe> = new Loadable
  private readonly route = inject(ActivatedRoute);
  @Input() id: number = 0
  @Input() lang: string = 'en'

  // translations
  private subscription: Subscription;   
  private trIDs = [
    'app.dialog.submitLesson.success',
    'app.dialog.submitLesson.failure',
    'app.dialog.close',
  ];
  tr: Record<string, string> = {};
  // track if add word working
  submitLessonPending: boolean = false;

  // progress tracking
  @ViewChild('progressMeter') progressMeter!: FloatingProgressMeterComponent;
  ptInit = false
  ptIncrementedMc: boolean[] = []
  ptIncrementedFb: boolean[] = []
  ptTotal = 0
  ptAnswered = 0
  ptInitialize() { 
    this.ptIncrementedMc = Array(this.exerciseBe.data!.mcRange.length).fill(false)
    this.ptIncrementedFb = Array(this.exerciseBe.data!.fbRange.length).fill(false)

    this.ptTotal = this.exerciseBe.data!.mcRange.length + this.exerciseBe.data!.fbRange.length

    this.ptInit = true
  }

  @Input() triggerFinish = new EventEmitter<void>;
  @Output() returnFeedback = new EventEmitter<string[]> 
  feedbackData: string[] = ['', '']

  handleMcAnswerSubmission(val: string, id: number) {
    if (!this.ptInit) { this.ptInitialize() }

    if (!this.ptIncrementedMc[id]) { 
      this.ptIncrementedMc[id] = true
      this.ptAnswered += 1
      this.progressMeter.changeProgress(Math.round(this.ptAnswered / this.ptTotal * 100))
    }

    this.exerciseBe.data!.mcGivenAnswers[id] = val
  }
  handleFbAnswerSubmission(val: string, id: number) {
    if (!this.ptInit) { this.ptInitialize() }

    if (!this.ptIncrementedFb[id]) { 
      this.ptIncrementedFb[id] = true
      this.ptAnswered += 1
      this.progressMeter.changeProgress(Math.round(this.ptAnswered / this.ptTotal * 100))
    }

    this.exerciseBe.data!.fbGivenAnswers[id] = val
  }
  validateAnswers() {
    let correct = 1, wrong = 1, missed = 1
    let feedbackCorrect = '<h6>Correct Answers:</h6>'
    let feedbackWrong = '<h6>Wrong Answers:</h6>'
    let feedbackMissed = '<h6>Missed Answers:</h6>'
    for (let i = 0; i < this.exerciseBe.data!.fbRange.length; i++) {
      if (this.exerciseBe.data!.fbGivenAnswers[i] === this.exerciseBe.data!.fbCorrectAnswers[i]) {
        if (correct !== 1) { feedbackCorrect += '<br>' }
        feedbackCorrect += `${correct}. ${this.exerciseBe.data!.fbBeforeBlank[i]} <strong>${this.exerciseBe.data!.fbGivenAnswers[i]}</strong> ${this.exerciseBe.data!.fbAfterBlank[i]}`    
        correct += 1  
      }
      else if (this.exerciseBe.data!.fbGivenAnswers[i] === 'null') { 
        if (missed !== 1) { feedbackMissed += '<br>' }
        feedbackMissed += `${missed}. ${this.exerciseBe.data!.fbBeforeBlank[i]} ___ ${this.exerciseBe.data!.fbAfterBlank[i]} Answer: <strong>${this.exerciseBe.data!.fbCorrectAnswers[i]}</strong>.`
        missed +=1
      }
      else {
        if (wrong !== 1) { feedbackWrong += '<br>' }
        feedbackWrong += `${wrong}. ${this.exerciseBe.data!.fbBeforeBlank[i]} <strong>${this.exerciseBe.data!.fbGivenAnswers[i]}</strong> ${this.exerciseBe.data!.fbAfterBlank[i]} Answer: <strong>${this.exerciseBe.data!.fbCorrectAnswers[i]}</strong>.`
        wrong += 1
      }
    }
    for (let i = 0; i < this.exerciseBe.data!.mcRange.length; i++) {
      if (this.exerciseBe.data!.mcGivenAnswers[i] === this.exerciseBe.data!.mcCorrectAnswers[i]) {
        if (correct !== 1) { feedbackCorrect += '<br>' }
        feedbackCorrect += `${correct}. ${this.exerciseBe.data!.mcQuestions[i]} Answer: <strong>${this.exerciseBe.data!.mcGivenAnswers[i]}</strong>.`
        correct += 1
      }
      else if (this.exerciseBe.data!.mcGivenAnswers[i] === 'null') { 
        if (missed !== 1) { feedbackMissed += '<br>' }
        feedbackMissed += `${missed}. ${this.exerciseBe.data!.mcQuestions[i]} Answer: <strong>${this.exerciseBe.data!.mcCorrectAnswers[i]}</strong>.`
        missed +=1
      }
      else {
        if (wrong !== 1) { feedbackWrong += '<br>' }
        feedbackWrong += `${wrong}. ${this.exerciseBe.data!.mcQuestions[i]} Answer: <strong>${this.exerciseBe.data!.mcCorrectAnswers[i]}</strong>.`
        wrong += 1
      }
    }
    correct -= 1
    wrong -= 1
    missed -= 1
    
    if (correct > 0) { this.feedbackData[1] += feedbackCorrect }
    if (wrong > 0) { 
      if (correct > 0) { this.feedbackData[1] += '<hr>' }
      this.feedbackData[1] += feedbackWrong 
    }
    if (missed > 0) {
      if (correct > 0 || wrong > 0) { this.feedbackData[1] += '<hr>' }
      this.feedbackData[1] += feedbackMissed
    }
    
    
    let perc = correct / (correct + wrong + missed)

    if (perc < 0.5) {
      this.feedbackData[0] = 'You failed!'
    } else if (perc < 0.7) {
      this.feedbackData[0] = 'Mission success!'
    } else if (perc < 0.99) {
      this.feedbackData[0] = 'Good job!'
    } else {
      this.feedbackData[0] = 'You are a legend!'
    }
    this.feedbackData[0] += ` (${Math.round(perc * 100)}% correct)`


    this.submitLessonPending = true
    this.lessonService.submitLesson(this.id,  perc > 0.5, correct).subscribe({
      next: (response) => {
        this.showNotification(this.tr['app.dialog.submitLesson.success']);
        this.submitLessonPending = false;
      },
      error: (error) => {
        console.error('submitLesson failed', error);
        this.showNotification(this.tr['app.dialog.submitLesson.failure']);
        this.submitLessonPending = false;
      }
    });
  }


  constructor(
    private lessonService: LessonService, 
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private router: Router
  ) {
    this.subscription = new Subscription();
  }

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

    this.subscription = this.translate
    .stream(this.trIDs)
    .subscribe((translations: Record<string, string>) => {
      this.tr = translations;
    });

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
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


