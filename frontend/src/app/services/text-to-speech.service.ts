import { Injectable } from '@angular/core';

const langMap: { [key: string]: string } = {
  'en': 'en-US',      // English
  'de': 'de-DE',      // German
  'ru': 'ru-RU',      // Russian
  'be': 'be-BY'       // Belarusian
};

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {

  private synth?: SpeechSynthesis;
  private utterance?: SpeechSynthesisUtterance;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
      this.utterance = new SpeechSynthesisUtterance();
    }
  }

  speak(text: string, lang: string, rate: number = 1) {
    if (typeof window === 'undefined' || !this.synth || !this.utterance) return;
    if (this.synth.speaking) {
      console.warn('Speech synthesis is already in progress.');
      return;
    }

    this.utterance.text = text;
    this.utterance.lang = langMap[lang] || 'en-US';
    this.utterance.rate = rate;

    this.synth.speak(this.utterance);
  }

  stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
  }
}
