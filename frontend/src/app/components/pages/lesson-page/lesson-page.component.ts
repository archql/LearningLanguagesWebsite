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
import { Observable } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LessonFinishedModalComponent } from '../lesson-finished-modal/lesson-finished-modal.component';


@Component({
  selector: 'app-lesson-page',
  standalone: true,
  imports: [ContextMenuComponent, MatCardModule, MatButtonModule, CommonModule, ExerciseComponent, MatDialogModule],
  templateUrl: './lesson-page.component.html',
  styleUrl: './lesson-page.component.scss'
})
export class LessonPageComponent implements CanComponentDeactivate {

  lessonFilename = ''
  lesson: Lesson = {'topic': '', 'vocabulary_list': [''], 'introduction': '', 'presentation': '', 'conclusion': '',
    'practice': []
  }

  constructor(private lessonService: LessonService, private dialog: MatDialog) {}
  private readonly route = inject(ActivatedRoute);
  ngOnInit() {
    const lessonId = this.route.snapshot.paramMap.get('id');
    this.lessonFilename = `lesson_${lessonId}.json`
    this.loadLesson()
  }
  loadLesson() {
    this.lessonService.loadLesson(this.lessonFilename).subscribe(
      (data) => { this.lesson = data;},
      (error) => {console.error('Failed to load questions', error);}
    );
  }


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


  triggerFinish: EventEmitter<void> = new EventEmitter<void>();
  getFeedback() { this.triggerFinish.emit(); }

  showFeedback(data: string[]) {
    const dialogRef = this.dialog.open(LessonFinishedModalComponent, {
      width: '640px',
      data: { title: data[0], message: data[1] }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal closed.');
    });
  }
}
