import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader-wrapper',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, MatIconModule],
  templateUrl: './loader-wrapper.component.html',
  styleUrl: './loader-wrapper.component.scss'
})
export class LoaderWrapperComponent {
  private _loading = signal<boolean>(true);

  @Input() spinnerStyles: { [klass: string]: any } = {};
  @Input() error?: string;

  @Input()
  set loading(value: boolean) {
    this._loading.set(value);
  }

  get loading(): boolean {
    return this._loading();
  }
}
