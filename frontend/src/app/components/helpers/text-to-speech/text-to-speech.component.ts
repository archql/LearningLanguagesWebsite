import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TextToSpeechService } from '../../../services/text-to-speech.service';

@Component({
  selector: 'app-text-to-speech',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './text-to-speech.component.html',
  styleUrl: './text-to-speech.component.scss'
})
export class TextToSpeechComponent {

  @Input() textToSpeak: string = '';

  isSpeaking: boolean = false;

  constructor(private tts : TextToSpeechService) {}

  speak() {
    if (typeof window === 'undefined') return;
    if (!this.isSpeaking) {
      this.isSpeaking = true;
      this.textToSpeak = this.textToSpeak.replace(/<[^>]*>/g, '. ');
      this.tts.speak(this.textToSpeak, localStorage.getItem('language') || 'en');
      this.checkSpeechEnd();
    } else {
      this.stop();
    }
  }

  stop() {
    if (typeof window === 'undefined') return;
    this.tts.stop();
    this.isSpeaking = false;
  }

  private checkSpeechEnd() {
    if (typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    const interval = setInterval(() => {
      if (!synth.speaking) {
        this.isSpeaking = false;
        clearInterval(interval);
      }
    }, 200);
  }
}
