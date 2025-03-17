import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LessonPageComponent } from './lesson-page.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';


describe('LessonPageComponent', () => {
  let component: LessonPageComponent;
  let fixture: ComponentFixture<LessonPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LessonPageComponent,
        TranslateModule.forRoot(),
        BrowserAnimationsModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TranslateService,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: MatDialog, useValue: { open: jasmine.createSpy('open') } },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LessonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should allow deactivation when lesson is finished', () => {
    component.lessonFinished = true;
    expect(component.canDeactivate()).toBeTrue();
  });

  it('should prompt confirmation when lesson is not finished', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.lessonFinished = false;
    expect(component.canDeactivate()).toBeTrue();
  });

  it('should emit triggerFinish event on getFeedback()', () => {
    spyOn(component.triggerFinish, 'emit');
    component.getFeedback();
    expect(component.triggerFinish.emit).toHaveBeenCalled();
  });

});
