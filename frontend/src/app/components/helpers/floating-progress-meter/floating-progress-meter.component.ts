import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import this


@Component({
  selector: 'app-floating-progress-meter',
  standalone: true,
  imports: [CommonModule],  // Add CommonModule here
  templateUrl: './floating-progress-meter.component.html',
  styleUrls: ['./floating-progress-meter.component.scss']
})
export class FloatingProgressMeterComponent {
    pr = 0

  get progress(): number {
    return this.pr
  }

  changeProgress(num: number) {
    this.pr = num
  }
}