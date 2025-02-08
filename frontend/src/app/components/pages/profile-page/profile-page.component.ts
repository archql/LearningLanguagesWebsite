import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Language, LearningLanguages } from '../../helpers/language-selector/language.model';
import { LanguageSelectorComponent } from '../../helpers/language-selector/language-selector.component';
import { ConfirmationDialogComponent } from '../../helpers/confirmation-dialog/confirmation-dialog.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [LanguageSelectorComponent, TranslateModule, MatCardModule, MatButtonModule, MatInputModule, MatDialogModule, MatSnackBarModule, MatIconModule, MatTooltipModule, MatProgressSpinnerModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  private subscription: Subscription;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private translate: TranslateService) {
    this.subscription = new Subscription();
  }

  private trIDs = [
    'app.dialog.change-language',
    'app.dialog.change-language.prompt',
    'app.dialog.change-language.success',
    'app.dialog.delete-progress',
    'app.dialog.delete-progress.prompt',
    'app.dialog.delete-progress.success',
    'app.dialog.delete-progress.success',
    'app.dialog.vocabulary-upload.success',
    'app.dialog.vocabulary-upload.failure-not-yaml',
    'app.dialog.vocabulary-download.success',
    'app.dialog.close',
  ];
  private tr: Record<string, string> = {};

  ngOnInit(): void {
    if (this.languages.length === 0) return;
    //
    this.subscription = this.translate
      .stream(this.trIDs)
      .subscribe((translations: Record<string, string>) => {
        this.languages.forEach((e) => {
          this.tr = translations;
        });
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // TODO replace with actual user data service
  user = {
    nickname: 'JohnDoe',
    email: 'johndoe@example.com',
    learningLanguage: { code: 'en', name: 'English', flagIcon: '🇺🇸' },
  };

  languages: Language[] = LearningLanguages;

  // Handle language selection
  onLanguageSelected(language: Language): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: this.tr['app.dialog.change-language'],
        message: this.tr['app.dialog.change-language.prompt'],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.user.learningLanguage = language;
        this.snackBar.open(this.tr['app.dialog.change-language.success'], this.tr['app.dialog.close'], {
          duration: 3000,
        });
      }
    });
  }

  // Download vocabulary
  downloadVocabulary(): void {
    // TODO Implement download logic here
    this.snackBar.open(this.tr['app.dialog.vocabulary-download.success'], this.tr['app.dialog.close'], { duration: 3000 });
  }

  // Handle file upload
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/yaml' || file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
        this.snackBar.open(this.tr['app.dialog.vocabulary-upload.success'], this.tr['app.dialog.close'], { duration: 3000 });
      } else {
        this.snackBar.open(this.tr['app.dialog.vocabulary-upload.failure-not-yaml'], this.tr['app.dialog.close'], { duration: 3000 });
      }
    }
  }

  // Confirm progress deletion
  confirmDeleteProgress(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: this.tr['app.dialog.delete-progress'],
        message: this.tr['app.dialog.delete-progress.prompt'],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Implement progress deletion logic here
        this.snackBar.open(this.tr['app.dialog.delete-progress.success'], this.tr['app.dialog.close'], { duration: 3000 });
      }
    });
  }
}
