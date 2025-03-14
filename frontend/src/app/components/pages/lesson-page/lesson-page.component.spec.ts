import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LessonPageComponent } from './lesson-page.component';
import { LessonService } from '../../../services/lesson.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LessonFinishedModalComponent } from '../lesson-finished-modal/lesson-finished-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';


describe('LessonPageComponent', () => {
  let component: LessonPageComponent;
  let fixture: ComponentFixture<LessonPageComponent>;
  let lessonServiceSpy: jasmine.SpyObj<LessonService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    lessonServiceSpy = jasmine.createSpyObj('LessonService', ['loadLesson']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        NoopAnimationsModule,
        LessonPageComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: LessonService, useValue: lessonServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { 
          provide: OverlayContainer, 
          useValue: { 
            getContainerElement: () => {
              const container = document.createElement('div');
              document.body.appendChild(container);
              return container;
            } 
          } 
        },
        TranslateService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        }
      ]
    }).compileComponents();
    TestBed.overrideProvider(MatDialog, { useValue: dialogSpy });
    
    fixture = TestBed.createComponent(LessonPageComponent);
    component = fixture.componentInstance;
    
    lessonServiceSpy.loadLesson.and.returnValue(of({
      topic: 'Test Topic',
      vocabulary_list: ['Word1', 'Word2'],
      introduction: 'Introduction Text',
      presentation: 'Presentation Text',
      conclusion: 'Conclusion Text',
      practice: []
    }));

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load lesson data on init', () => {
    fixture.detectChanges();

    expect(component.lesson.topic).toEqual('Test Topic');
    expect(component.lesson.vocabulary_list).toEqual(['Word1', 'Word2']);
  });

  it('should trigger finish event and open dialog', () => {
    const feedbackData = ['Title', 'Message'];
  
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'close']);
    dialogRefSpy.afterClosed.and.returnValue(of(true));
  
    dialogSpy.open.and.returnValue(dialogRefSpy as any);
  
    component.showFeedback(feedbackData);
  
    expect(dialogSpy.open).toHaveBeenCalledWith(LessonFinishedModalComponent, {
      width: '640px',
      data: { title: 'Title', message: 'Message' }
    });
  });

  it('should confirm before navigating away', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    expect(component.canDeactivate()).toBeTrue();
  });

  it('should prevent navigation if unsaved changes exist', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    expect(component.canDeactivate()).toBeFalse();
  });
});

