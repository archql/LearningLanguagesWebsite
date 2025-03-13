import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import { CommonModule } from '@angular/common';


interface Option {
  label: string;
  value: string;
}

@Component({
  selector: 'app-multiple-choice',
  standalone: true,
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss'],
  imports: [MatCardModule, MatRadioModule, CommonModule],
})
export class MultipleChoiceComponent {
  @Input() question: string = '';
  @Input() options: string[] = [];
  @Output() answerSelected = new EventEmitter<string>();

  selectedOption: string = '';

  selectOption(event: MatRadioChange): void {
    this.selectedOption = event.value;
    this.answerSelected.emit(event.value);
  }
}