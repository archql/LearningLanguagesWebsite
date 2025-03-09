import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { VocabularyGroup, VocabularyWord } from './vocabulary.model';
import { LoaderWrapperComponent } from "../../helpers/loader-wrapper/loader-wrapper.component";
import { Loadable } from '../../helpers/loader-wrapper/loader-wrapper.model';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { UserServiceMock } from '../../../services/mock/user.service.mock';

@Component({
  selector: 'app-vocabulary-page',
  standalone: true,
  imports: [TranslateModule, MatCardModule, MatListModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule, LoaderWrapperComponent],
  templateUrl: './vocabulary-page.component.html',
  styleUrl: './vocabulary-page.component.scss'
})
export class VocabularyPageComponent {
  // TODO add service to fetch vocabulary from DB
  vocabulary: Loadable< VocabularyGroup[] > = new Loadable;
  loading: boolean = false;

  private subscription: Subscription = new Subscription();
  private trIDs = [
    'app.dialog.word_remove.success',
    'app.dialog.word_remove.fail',
  ];
  tr: Record<string, string> = {};

  constructor(
    private snackBar: MatSnackBar, 
    private userService: UserService, 
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.vocabulary = new Loadable(() => this.userService.getVocabulary())
    this.subscription = this.translate
      .stream(this.trIDs)
      .subscribe((translations: Record<string, string>) => {
        this.tr = translations;
      });
  }

  ngOnDestroy() {
    this.vocabulary.cleanup();
    this.subscription.unsubscribe();
  }

  // Remove a word from the vocabulary
  removeWord(group: VocabularyGroup, word: VocabularyWord): void {
    const index = group.words.indexOf(word);
    if (index > -1) {
      this.userService.removeWord(word).subscribe({
        next: (response) => {
          if (response) {
            this.snackBar.open(`${this.tr['app.dialog.word_remove.success']} ${word.word}`, 'Close', { duration: 3000 });
            group.words.splice(index, 1);
          } else {
            this.snackBar.open(`${this.tr['app.dialog.word_remove.failure']} ${word.word}`, 'Close', { duration: 3000 });
          }
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open(`${this.tr['app.dialog.word_remove.failure']} ${word.word}`, 'Close', { duration: 3000 });
          this.loading = false;
        },
      });

      // group.words.splice(index, 1);
      // this.snackBar.open(`Removed: ${word.word}`, 'Close', { duration: 3000 });
    }
    // TODO add DB logic to remove word
  }
}
