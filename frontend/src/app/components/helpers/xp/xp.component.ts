import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-xp',
  standalone: true,
  imports: [MatCard, MatIcon],
  templateUrl: './xp.component.html',
  styleUrl: './xp.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px) scale(0.8)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px) scale(0.8)' }))
      ])
    ])
  ]
})
export class XpComponent implements OnInit {
  @Input() xpAmount: number = 100;
  displayXP: number = 0;

  ngOnInit() {
    this.animateXP();
  }

  animateXP() {
    let start = 0;
    const end = this.xpAmount;
    const duration = 1000; // 1 second
    const interval = 20; // Update every 20ms
    const step = (end - start) / (duration / interval);

    const counter = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      this.displayXP = Math.floor(start);
    }, interval);
  }
}
