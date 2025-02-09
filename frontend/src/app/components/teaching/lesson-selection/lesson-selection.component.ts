import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LessonService } from '../../../services/lesson.service';
import { Lesson, Topic } from './lesson-selection.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-lesson-selection',
  standalone: true,
  imports: [MatExpansionModule, MatListModule, MatIconModule, 
    NgClass, MatAutocompleteModule, MatInputModule, MatFormFieldModule, AsyncPipe, ReactiveFormsModule],
  templateUrl: './lesson-selection.component.html',
  styleUrl: './lesson-selection.component.scss'
})
export class LessonSelectionComponent {
  @Input() topics: Topic[] = [];
  searchControl = new FormControl(''); // FormControl for the search input
  filteredLessons!: Observable<Lesson[]>; // Observable for filtered lessons

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the filtered lessons observable
    this.filteredLessons = this.searchControl.valueChanges.pipe(
      startWith(''), // Start with an empty string
      map((value) => this._filterLessons(value || '')) // Filter lessons based on the input
    );
  }
  // Filter lessons based on the search input
  private _filterLessons(value: string): Lesson[] {
    const searchTerm = value.toLowerCase();
    return this.topics
      .flatMap((topic) => topic.lessons) // Flatten the lessons array
      .filter((lesson) => lesson.title.toLowerCase().includes(searchTerm)); // Filter by title
  }

  // Handle lesson selection from the autocomplete
  onLessonSelected(event: any): void {
    const selectedLessonTitle = event.option.value;
    const selectedLesson = this.topics
      .flatMap((topic) => topic.lessons)
      .find((lesson) => lesson.title === selectedLessonTitle);

    if (selectedLesson) {
      this.goToLesson(selectedLesson.route);
    }
  }

  goToLesson(route: string): void {
    this.router.navigate([route]);
  }
}
