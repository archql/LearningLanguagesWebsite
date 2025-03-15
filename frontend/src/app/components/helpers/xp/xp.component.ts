import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-xp',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule],
  templateUrl: './xp.component.html',
  styleUrls: ['./xp.component.scss'],
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
  @Input() xpGain: boolean = false;
  @Input() xpAmount: number = 100;
  @ViewChild('xpContainer', { static: false }) xpContainer!: ElementRef;

  displayXP: number = 0;
  particles: { id: number; x: number; y: number; opacity: number }[] = [];

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

  ngAfterViewInit() {
    // Get container width dynamically
    if (this.xpContainer?.nativeElement) {
      this.width = this.xpContainer.nativeElement.offsetWidth;
      this.height = this.xpContainer.nativeElement.offsetHeight;
    }
    // Defer particle creation to avoid change detection errors
    setTimeout(() => {
      this.createParticles();
    });
  }

  width: number = 200;
  height: number = 50;

  createParticles() {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        id: i,
        x: Math.random() * this.width - 50, // Random X position
        y: Math.random() * this.height - 10, // Random Y position
        opacity: Math.random(), // Random opacity
      });
    }
  }

  animateParticles() {
    const animationDuration = 1000; // 1 second
    const interval = 16; // ~60 FPS

    const animate = () => {
      this.particles.forEach(particle => {
        particle.opacity -= 0.02; // Fade out over time
      });

      // Remove particles that are fully transparent
      this.particles = this.particles.filter(p => p.opacity > 0);

      // Continue animation if there are still particles
      if (this.particles.length > 0) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }
}
