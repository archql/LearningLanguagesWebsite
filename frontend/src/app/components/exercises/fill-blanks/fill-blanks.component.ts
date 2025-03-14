import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';



@Component({
  selector: 'app-fill-blanks',
  standalone: true,
  templateUrl: './fill-blanks.component.html',
  styleUrls: ['./fill-blanks.component.scss'],
  imports: [MatCardModule, MatInputModule, MatButtonModule, FormsModule, CommonModule]
})
export class FillBlanksComponent {
  @Input() beforeBlank: string = '';
  @Input() afterBlank: string = '';
  @Input() id: number = 0;
  @Output() answerSubmitted = new EventEmitter<string>();

  userAnswer: string = '';
  private answerChange$ = new Subject<void>();

  submitAnswer() {
    this.answerSubmitted.emit(this.userAnswer.trim().toLowerCase())
  }

  ngOnInit() {
    // Listen for changes with a delay of 1000ms before checking answers
    this.answerChange$.pipe(debounceTime(1000)).subscribe(() => this.submitAnswer());
  }

  onInputChange() {
    this.answerChange$.next();
  }
}