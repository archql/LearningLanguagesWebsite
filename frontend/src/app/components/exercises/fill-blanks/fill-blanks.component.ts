import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TextToSpeechComponent } from '../../helpers/text-to-speech/text-to-speech.component';
import { SpecialCharPanelComponent } from '../../helpers/special-char-panel/special-char-panel.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';


@Component({
  selector: 'app-fill-blanks',
  standalone: true,
  templateUrl: './fill-blanks.component.html',
  styleUrls: ['./fill-blanks.component.scss'],
  imports: [MatCardModule, MatInputModule, MatButtonModule, FormsModule, CommonModule, TextToSpeechComponent]
})
export class FillBlanksComponent {
  @Input() beforeBlank: string = '';
  @Input() afterBlank: string = '';
  @Input() id: number = 0;
  @Input() lang: string = 'en';
  @Output() answerSubmitted = new EventEmitter<string>();

  userAnswer: string = '';
  private answerChange$ = new Subject<void>();

  submitAnswer() {
    this.answerSubmitted.emit(this.userAnswer.trim().toLowerCase())
  }

  ngOnInit() {
    // Listen for changes with a delay of 1000ms before checking answers
    this.answerChange$.pipe(debounceTime(1000)).subscribe(() => this.submitAnswer());
  }

  onInputChange() {
    this.answerChange$.next();
  }

  // Special Char Panel stuff
  private overlayRef?: OverlayRef;
  private activeInput?: HTMLInputElement;

  constructor(private overlay: Overlay, private renderer: Renderer2) {}

  showPanel(event: FocusEvent) {
    if (this.lang === 'en') return

    this.activeInput = event.target as HTMLInputElement;

    if (this.overlayRef) {
      this.overlayRef.detach();
    }

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.activeInput)
      .withPositions([{ 
        originX: 'start', originY: 'bottom', 
        overlayX: 'start', overlayY: 'top'
      }]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop'
    });

    const charPanelPortal = new ComponentPortal(SpecialCharPanelComponent);
    const componentRef = this.overlayRef.attach(charPanelPortal);

    componentRef.instance.charSelected.subscribe(char => this.insertChar(char));
    this.overlayRef.backdropClick().subscribe(() => this.overlayRef?.detach());
  }

  insertChar(char: string) {
    if (!this.activeInput) return;

    const input = this.activeInput;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const text = input.value;

    input.value = text.slice(0, start) + char + text.slice(end);
    input.setSelectionRange(start + 1, start + 1);
    input.focus();
  }
}