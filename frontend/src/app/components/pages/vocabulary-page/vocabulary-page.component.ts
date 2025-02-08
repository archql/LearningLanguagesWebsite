import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { VocabularyGroup, VocabularyWord } from './vocabulary.model';

@Component({
  selector: 'app-vocabulary-page',
  standalone: true,
  imports: [TranslateModule, MatCardModule, MatListModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './vocabulary-page.component.html',
  styleUrl: './vocabulary-page.component.scss'
})
export class VocabularyPageComponent {
  // TODO add service to fetch vocabulary from DB
  vocabulary: VocabularyGroup[] = [
    {
      section: 'Animals',
      words: [
        { word: 'Die Katze', meaning: 'The cat' },
        { word: 'Der Hund', meaning: 'The Dog' },
      ],
    },
    {
      section: 'Food',
      words: [
        { word: 'Der Apfel', meaning: 'The apple' },
        { word: 'Das Brot', meaning: 'The bread' },
      ],
    },
  ];

  constructor(private snackBar: MatSnackBar) {}

  // Remove a word from the vocabulary
  removeWord(group: VocabularyGroup, word: VocabularyWord): void {
    const index = group.words.indexOf(word);
    if (index > -1) {
      group.words.splice(index, 1);
      this.snackBar.open(`Removed: ${word.word}`, 'Close', { duration: 3000 });
    }
    // TODO add DB logic to remove word
  }
}
