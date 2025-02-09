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
import { FormsModule } from '@angular/forms';
import { LoaderWrapperComponent } from "../../helpers/loader-wrapper/loader-wrapper.component";
import { Loadable } from '../../helpers/loader-wrapper/loader-wrapper.model';
import { User } from './user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [FormsModule, LanguageSelectorComponent, TranslateModule, MatCardModule, MatButtonModule, MatInputModule, MatDialogModule, MatSnackBarModule, MatIconModule, MatTooltipModule, MatProgressSpinnerModule, LoaderWrapperComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  private subscription: Subscription;

  constructor(
    private dialog: MatDialog, 
    private snackBar: MatSnackBar, 
    private translate: TranslateService,
    private userService: UserService
  ) {
    this.subscription = new Subscription();
  }

  private trIDs = [
    'app.dialog.change-language',
    'app.dialog.change-language.prompt',
    'app.dialog.change-language.success',
    'app.dialog.change-language.failure',
    'app.dialog.delete-progress',
    'app.dialog.delete-progress.prompt',
    'app.dialog.delete-progress.success',
    'app.dialog.delete-progress.failure',
    'app.dialog.vocabulary-upload.success',
    'app.dialog.vocabulary-upload.failure-not-yaml',
    'app.dialog.vocabulary-upload.failure',
    'app.dialog.vocabulary-download.success',
    'app.dialog.vocabulary-download.failure',
    'app.dialog.close',
  ];
  private tr: Record<string, string> = {};

  ngOnInit(): void {
    if (this.trIDs.length === 0) return;
    //
    this.subscription = this.translate
      .stream(this.trIDs)
      .subscribe((translations: Record<string, string>) => {
        this.tr = translations;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // 
  user: Loadable<User> = { loading: false };
  deleteProgressPending: boolean = false;
  languageChangePending: boolean = false;
  vocabularyDownloadPending: boolean = false;
  vocabularyUploadPending: boolean = false;
  //


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
        this.languageChangePending = true; // Stop loading
        // Implement progress deletion logic here
        this.userService.resetProgress().subscribe({
          next: (response) => {
            // TODO update UI
            if (response) {
              this.snackBar.open(this.tr['app.dialog.change-language.success'], this.tr['app.dialog.close'], { duration: 3000 });
              this.user.data!.language = language.code;
            } else {
              this.snackBar.open(this.tr['app.dialog.change-language.failure'], this.tr['app.dialog.close'], { duration: 3000 });
            }
          },
          error: (error) => {
            console.error('Language Change failed', error);
            this.snackBar.open(this.tr['app.dialog.change-language.failure'], this.tr['app.dialog.close'], { duration: 3000 });
          },
          complete: () => {
            this.languageChangePending = false; // Stop loading
          },
        });
      }
    });
  }

  // Download vocabulary
  downloadVocabulary(): void {
    this.vocabularyDownloadPending = true;
    this.userService.downloadVocabulary().subscribe({
      next: (response) => {
        // TODO update UI
        if (response) {
          this.snackBar.open(this.tr['app.dialog.vocabulary-download.success'], this.tr['app.dialog.close'], { duration: 3000 });
        } else {
          this.snackBar.open(this.tr['app.dialog.vocabulary-download.failure'], this.tr['app.dialog.close'], { duration: 3000 });
        }
      },
      error: (error) => {
        console.error('Language Change failed', error);
        this.snackBar.open(this.tr['app.dialog.vocabulary-download.failure'], this.tr['app.dialog.close'], { duration: 3000 });
      },
      complete: () => {
        this.vocabularyDownloadPending = false; // Stop loading
      },
    });
  }

  // Handle file upload
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log(input.files, input.files?.length)
    if (input.files && input.files.length > 0) {
      console.log("sdfsdfadssd")
      const file = input.files[0];
      if (file.type === 'application/yaml' || file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
        this.vocabularyUploadPending = true;
        this.userService.uploadVocabulary(file).subscribe({
          next: (response) => {
            // TODO update UI
            if (response) {
              this.snackBar.open(this.tr['app.dialog.vocabulary-upload.success'], this.tr['app.dialog.close'], { duration: 3000 });
            } else {
              this.snackBar.open(this.tr['app.dialog.vocabulary-upload.failure'], this.tr['app.dialog.close'], { duration: 3000 });
            }
          },
          error: (error) => {
            console.error('Language Change failed', error);
            this.snackBar.open(this.tr['app.dialog.vocabulary-upload.failure'], this.tr['app.dialog.close'], { duration: 3000 });
          },
          complete: () => {
            this.vocabularyUploadPending = false; // Stop loading
          },
        });
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
        this.deleteProgressPending = true; // Stop loading
        // Implement progress deletion logic here
        this.userService.resetProgress().subscribe({
          next: (response) => {
            // TODO reload required
            if (response) {
              this.snackBar.open(this.tr['app.dialog.delete-progress.success'], this.tr['app.dialog.close'], { duration: 3000 });
            } else {
              this.snackBar.open(this.tr['app.dialog.delete-progress.failure'], this.tr['app.dialog.close'], { duration: 3000 });
            }
          },
          error: (error) => {
            console.error('DeleteProgress failed', error);
            this.snackBar.open(this.tr['app.dialog.delete-progress.failure'], this.tr['app.dialog.close'], { duration: 3000 });
          },
          complete: () => {
            this.deleteProgressPending = false; // Stop loading
          },
        });
      }
    });
  }
}
