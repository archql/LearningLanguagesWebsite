import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LessonFinishedModalComponent } from './lesson-finished-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { XpComponent } from '../../helpers/xp/xp.component';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockRouter {
  navigate = jasmine.createSpy('navigate').and.returnValue(of(true));
}

class MockDialogRef {
  close = jasmine.createSpy('close');
}


describe('LessonFinishedModalComponent', () => {
  let component: LessonFinishedModalComponent;
  let fixture: ComponentFixture<LessonFinishedModalComponent>;
  let router: MockRouter;
  let dialogRef: MockDialogRef;

  beforeEach(async () => {
    router = new MockRouter();
    dialogRef = new MockDialogRef();

    await TestBed.configureTestingModule({
      imports: [LessonFinishedModalComponent, CommonModule, MatButtonModule, XpComponent, BrowserAnimationsModule],
      providers: [
        { provide: Router, useValue: router },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { title: 'Test Title', message: 'Test Message', ptGained: 50 } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LessonFinishedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have injected data with correct values', () => {
    expect(component.data!.title).toBe('Test Title');
    expect(component.data!.message).toBe('Test Message');
    expect(component.data!.ptGained).toBe(50);
  });

  it('should handle missing injected data', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [LessonFinishedModalComponent, CommonModule, MatButtonModule, XpComponent, BrowserAnimationsModule],
      providers: [
        { provide: Router, useValue: router },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null }
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(LessonFinishedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  
    expect(component.data!.title).toBe('Default Title');
    expect(component.data!.message).toBe('Default Message');
    expect(component.data!.ptGained).toBe(0);
  });

  it('should close the dialog when onClose is called', () => {
    component.onClose();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should navigate to /home/dashboard after closing', () => {
    component.onClose();
    expect(router.navigate).toHaveBeenCalledWith(['/home/dashboard']);
  });

  it('should handle router navigation failure gracefully', () => {
    router.navigate.and.returnValue(throwError(() => new Error('Navigation failed')));

    component.onClose();

    router.navigate(['/home/dashboard']).subscribe({
      error: (error: any) => {
        expect(error.message).toBe('Navigation failed');
      }
    });
  });

  it('should handle dialog close failure gracefully', () => {
    dialogRef.close.and.throwError('Dialog close failed');
    expect(() => component.onClose()).toThrowError('Dialog close failed');
  });

  it('should render XpComponent', () => {
    const xpComponent = fixture.nativeElement.querySelector('app-xp');
    expect(xpComponent).toBeTruthy();
  });

});
