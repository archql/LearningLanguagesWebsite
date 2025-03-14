import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultipleChoiceComponent } from './multiple-choice.component';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule, MatRadioChange } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';


describe('MultipleChoiceComponent', () => {
  let component: MultipleChoiceComponent;
  let fixture: ComponentFixture<MultipleChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleChoiceComponent, MatCardModule, MatRadioModule, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleChoiceComponent);
    component = fixture.componentInstance;
    component.question = 'What is the capital of France?';
    component.options = ['Paris', 'London', 'Rome', 'Berlin'];
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the question and options', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('What is the capital of France?');
    expect(compiled.textContent).toContain('Paris');
    expect(compiled.textContent).toContain('London');
    expect(compiled.textContent).toContain('Rome');
    expect(compiled.textContent).toContain('Berlin');
  });

  it('should emit the selected answer', () => {
    spyOn(component.answerSelected, 'emit');
    
    const radioGroup = fixture.debugElement.query(By.css('mat-radio-group'));
    
    const changeEvent = new MatRadioChange(radioGroup.componentInstance, 'Paris');
    component.selectOption(changeEvent);
    fixture.detectChanges();

    expect(component.answerSelected.emit).toHaveBeenCalledWith('Paris');
  });

  it('should update selectedOption when an option is selected', () => {
    component.selectOption({ value: 'Paris' } as any);
    expect(component.selectedOption).toBe('Paris');
  });
});
