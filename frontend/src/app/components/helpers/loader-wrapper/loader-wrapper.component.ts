import { Component, Input, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader-wrapper',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './loader-wrapper.component.html',
  styleUrl: './loader-wrapper.component.scss'
})
export class LoaderWrapperComponent {
  private _loading = signal<boolean>(true);

  @Input()
  set loading(value: boolean) {
    this._loading.set(value);
  }

  get loading(): boolean {
    return this._loading();
  }
}
