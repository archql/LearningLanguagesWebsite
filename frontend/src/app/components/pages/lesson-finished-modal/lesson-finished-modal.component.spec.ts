import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LessonFinishedModalComponent } from './lesson-finished-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';


describe('LessonFinishedModalComponent', () => {
  let component: LessonFinishedModalComponent;
  let fixture: ComponentFixture<LessonFinishedModalComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<LessonFinishedModalComponent>>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LessonFinishedModalComponent, MatButtonModule, CommonModule, RouterTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { title: 'Test Title', message: 'Test Message' } },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LessonFinishedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the passed title and message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Title');
    expect(compiled.textContent).toContain('Test Message');
  });

  it('should close the dialog and navigate when onClose() is called', () => {
    component.onClose();

    expect(dialogRefSpy.close).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home/dashboard']);
  });
});
