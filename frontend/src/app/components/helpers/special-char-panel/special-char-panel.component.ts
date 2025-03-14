import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-special-char-panel',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, CommonModule],
  templateUrl: './special-char-panel.component.html',
  styleUrl: './special-char-panel.component.scss'
})
export class SpecialCharPanelComponent {
  @Output() charSelected = new EventEmitter<string>();

  specialChars = ['ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü', 'ß'];

  addChar(char: string) {
    this.charSelected.emit(char);
  }
}
