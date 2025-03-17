import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextToSpeechComponent } from './text-to-speech.component';

describe('TextToSpeechComponent', () => {
  let component: TextToSpeechComponent;
  let fixture: ComponentFixture<TextToSpeechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextToSpeechComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextToSpeechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start speaking when speak() is called', () => {
    component.textToSpeak = 'Hello world';
    component.speak();
    expect(component.isSpeaking).toBeTrue();
  });

  it('should stop speaking when stop() is called', () => {
    component.textToSpeak = 'Hello world';
    component.speak();
    component.stop();
    expect(component.isSpeaking).toBeFalse();
  });

  it('should not start speaking if textToSpeak is empty', () => {
    component.textToSpeak = '';
    component.speak();
    expect(component.isSpeaking).toBeFalse();
  });

  it('should toggle speaking state when speak() is called twice', () => {
    component.textToSpeak = 'Hello world';
    component.speak();
    expect(component.isSpeaking).toBeTrue();
    component.speak();
    expect(component.isSpeaking).toBeFalse();
  });
});
