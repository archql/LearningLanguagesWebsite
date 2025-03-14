import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { TextToSpeechComponent } from '../../helpers/text-to-speech/text-to-speech.component';


interface Option {
  label: string;
  value: string;
}

@Component({
  selector: 'app-multiple-choice',
  standalone: true,
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss'],
  imports: [MatCardModule, MatRadioModule, CommonModule, TextToSpeechComponent],
})
export class MultipleChoiceComponent {
  @Input() question: string = '';
  @Input() options: string[] = [];
  @Input() id: number = 0;
  @Output() answerSelected = new EventEmitter<string>();

  selectedOption: string = '';

  selectOption(event: MatRadioChange): void {
    this.selectedOption = event.value;
    this.answerSelected.emit(event.value);
  }
}