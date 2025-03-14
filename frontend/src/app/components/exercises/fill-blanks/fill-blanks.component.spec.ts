import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FillBlanksComponent } from './fill-blanks.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { fakeAsync, tick } from '@angular/core/testing';


describe('FillBlanksComponent', () => {
  let component: FillBlanksComponent;
  let fixture: ComponentFixture<FillBlanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FillBlanksComponent, MatInputModule, MatButtonModule, MatCardModule, FormsModule, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FillBlanksComponent);
    component = fixture.componentInstance;
    component.beforeBlank = 'The capital of France is';
    component.afterBlank = '.';
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the before and after blank text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('The capital of France is');
    expect(compiled.textContent).toContain('.');
  });

  it('should emit the answer on submit', () => {
    spyOn(component.answerSubmitted, 'emit');
    component.userAnswer = 'Paris';
    component.submitAnswer();

    expect(component.answerSubmitted.emit).toHaveBeenCalledWith('paris');
  });

  it('should debounce input changes before submitting the answer', fakeAsync(() => {
    spyOn(component, 'submitAnswer');

    component.userAnswer = 'Berlin';
    component.onInputChange();

    tick(500);
    expect(component.submitAnswer).not.toHaveBeenCalled();

    tick(1001);
    expect(component.submitAnswer).toHaveBeenCalled();
  }));
});
