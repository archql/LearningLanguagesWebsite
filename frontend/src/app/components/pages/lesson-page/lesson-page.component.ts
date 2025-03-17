import { Component, HostListener, inject, EventEmitter } from '@angular/core';
import { MenuAction } from '../../helpers/menu-bar/menu-bar.model';
import { CanComponentDeactivate } from '../../../guards/can-deactivate.guard';
import { ContextMenuComponent } from '../../helpers/context-menu/context-menu.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { LessonService, Lesson } from '../../../services/lesson.service';
import { ExerciseComponent } from "../../exercises/exercise/exercise.component";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LessonFinishedModalComponent } from '../lesson-finished-modal/lesson-finished-modal.component';
import { TextToSpeechComponent } from "../../helpers/text-to-speech/text-to-speech.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoaderWrapperComponent } from "../../helpers/loader-wrapper/loader-wrapper.component";
import { Loadable } from '../../helpers/loader-wrapper/loader-wrapper.model';


@Component({
  selector: 'app-lesson-page',
  standalone: true,
  imports: [ContextMenuComponent, TranslateModule, MatCardModule, MatButtonModule, CommonModule, ExerciseComponent, MatDialogModule, TextToSpeechComponent, LoaderWrapperComponent],
  templateUrl: './lesson-page.component.html',
  styleUrl: './lesson-page.component.scss'
})
export class LessonPageComponent implements CanComponentDeactivate {

  lessonId: number = 0
  lesson: Loadable<Lesson> = new Loadable;

  // translations
  private subscription: Subscription;   
  private trIDs = [
    'app.dialog.add-word.success',
    'app.dialog.add-word.failure',
    'app.dialog.close',
  ];
  tr: Record<string, string> = {};
  // track if add word working
  addWordPending: boolean = false;
  // track if user ready to exit
  lessonFinished: boolean = false;
  //


  constructor(
    private lessonService: LessonService, 
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private router: Router
  ) {
    this.subscription = new Subscription();
  }
  private readonly route = inject(ActivatedRoute);
  ngOnInit() {
    const lessonId = this.route.snapshot.paramMap.get('id');
    if (lessonId === null) { this.router.navigate(['/home/dashboard'])}
    this.lessonId = parseInt(lessonId!)
    this.lesson = new Loadable(() => this.lessonService.loadLesson(this.lessonId));
    //
    this.subscription = this.translate
      .stream(this.trIDs)
      .subscribe((translations: Record<string, string>) => {
        this.tr = translations;
      });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.lesson.cleanup()
  }
  
  menuItems: MenuAction[] = [
    {
      trID: 'add-to-vocabulary',
      label: '',
      action: (e) => { 
        if (typeof window === 'undefined') return
        const lang = localStorage.getItem('language') || 'en';
        console.log('add-to-vocabulary: ', e) 
        this.addWordPending = true;
        this.lessonService.addWord(e, lang).subscribe({
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
    }
  ]
  canDeactivate(): boolean {
    if (this.lessonFinished) return true;
    return confirm('You have unsaved changes. Leave anyway?');
  }
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.lessonFinished) return true;
    event.preventDefault();
    return '';
  }
  @HostListener('window:unload', ['$event'])
  onUnload(event: Event): void {
    // save state here
  }


  triggerFinish: EventEmitter<void> = new EventEmitter<void>();
  getFeedback() { this.lessonFinished = true; this.triggerFinish.emit(); }

  showFeedback(data: string[]) {
    const dialogRef = this.dialog.open(LessonFinishedModalComponent, {
      width: '63%',
      data: { title: data[0], message: data[1] }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal closed.');
    });
  }

  // Helper method to show notifications
  showNotification(message: string) {
    this.snackBar.open(message, this.tr['app.dialog.close'], {
      duration: 3000, // Notification will auto-close after 3 seconds
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
