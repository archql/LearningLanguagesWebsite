import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePageComponent } from './profile-page.component';
import { UserService } from '../../../services/user.service';
import { MockUserService } from '../../../services/mock/user.service.mock';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { User } from './user.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ProfilePageComponent,
        MatDialogModule,
        MatSnackBarModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: UserService, useClass: MockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  

  it('should handle vocabulary download', () => {
    spyOn(userService, 'downloadVocabulary').and.returnValue(of(new Blob(['mock vocabulary content'], { type: 'text/yaml' })));
    spyOn(component['snackBar'], 'open');

    component.downloadVocabulary();

    expect(component.vocabularyDownloadPending).toBeFalse();
    expect(component['snackBar'].open).toHaveBeenCalledWith('app.dialog.vocabulary-download.success', 'app.dialog.close', { duration: 3000 });
  });

  it('should handle file upload', () => {
    const mockFile = new File(['mock content'], 'vocabulary.yaml', { type: 'text/yaml' });
    const event = { target: { files: [mockFile] } } as any;
    spyOn(userService, 'uploadVocabulary').and.returnValue(of(true));
    spyOn(component['snackBar'], 'open');

    component.onFileSelected(event);

    expect(component.vocabularyUploadPending).toBeFalse();
    expect(component['snackBar'].open).toHaveBeenCalledWith('app.dialog.vocabulary-upload.success', 'app.dialog.close', { duration: 3000 });
  });

  it('should handle progress deletion', () => {
    spyOn(component['dialog'], 'open').and.returnValue({
      afterClosed: () => of(true)
    } as any);
    spyOn(userService, 'resetProgress').and.returnValue(of(true));
    spyOn(component['snackBar'], 'open');

    component.confirmDeleteProgress();

    expect(component.deleteProgressPending).toBeFalse();
    expect(component['snackBar'].open).toHaveBeenCalledWith('app.dialog.delete-progress.success', 'app.dialog.close', { duration: 3000 });
  });

  it('should load translations on init', () => {
    spyOn(component['translate'], 'stream').and.returnValue(of({ 'app.dialog.change-language': 'Change Language' }));
    component.ngOnInit();
    expect(component.tr['app.dialog.change-language']).toBe('Change Language');
  });

  it('should handle language selection', () => {
    spyOn(component['dialog'], 'open').and.returnValue({
      afterClosed: () => of(true)
    } as any);
    spyOn(userService, 'resetProgress').and.returnValue(of(true));
    spyOn(component['snackBar'], 'open');

    // Initialize the user object
    component.user = { loading: false, data: { id: 1, login: 'JohnDoe', email: 'johndoe@example.com', language: 'en' } };

    component.onLanguageSelected({ code: 'fr', name: 'French', flagIcon: '🇫🇷' });

    expect(component.languageChangePending).toBeFalse();
    expect(component['snackBar'].open).toHaveBeenCalledWith('app.dialog.change-language.success', 'app.dialog.close', { duration: 3000 });
  });
});
