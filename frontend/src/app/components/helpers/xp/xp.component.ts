import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
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
export class XpComponent implements OnInit, AfterViewInit {
  @Input() xpGain: boolean = false;
  _xpAmount: number = 100;
  @ViewChild('xpContainer', { static: false }) xpContainer!: ElementRef;

  @Input()
  set xpAmount(value: number) {
    this._xpAmount = value
    this.league = this.xpGain ? 'gold' : this.getLeague(value);
    this.animateXP()
  }

  get xpAmount(): number {
    return this._xpAmount;
  }
  private xpInterval: any;

  displayXP: number = 0;
  particles: { id: number; x: number; y: number; opacity: number }[] = [];
  league: string = 'gold'; // Default league

  ngOnInit() {
    
  }

  animateXP() {
    clearInterval(this.xpInterval);
    let start = 0;
    const end = this.xpAmount;
    const duration = 1800; // 1 second
    const interval = 1000 / 60; // Update every 20ms
    const steps = duration / interval;
    let currentStep = 0;

    if (this.xpAmount) {
      // Defer particle creation to avoid change detection errors
      setTimeout(() => {
        this.createParticles();
        this.animateParticles();
      });
      this.xpInterval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic easing out
        this.displayXP = Math.floor(start + (end - start) * easedProgress);
  
        if (currentStep >= steps) {
          clearInterval(this.xpInterval);
          this.displayXP = end;
        }
      }, interval);
    }
  }

  ngAfterViewInit() {
    // Get container width dynamically
  }

  width: number = 0;
  height: number = 0;

  createParticles() {
    if (this.xpContainer?.nativeElement) {
      this.width = this.xpContainer.nativeElement.offsetWidth;
      this.height = this.xpContainer.nativeElement.offsetHeight;

      for (let i = 0; i < 30; i++) {
        this.particles.push({
          id: i,
          x: Math.random() * this.width, // Random X position
          y: Math.random() * this.height, // Random Y position
          opacity: Math.random() * 0.3 + 0.7, // Random opacity
        });
      }
    }
  }

  animateParticles() {
    if (typeof window === 'undefined') return
    const fps = 60;
    const interval = 2200 / fps; // Calculate interval based on FPS

    const animate = () => {
      this.particles.forEach(particle => {
        particle.opacity -= 1.0 / (interval); // Adjust fade out based on interval
        particle.y -= this.height / interval * 0.8
      });

      // Remove particles that are fully transparent
      this.particles = this.particles.filter(p => p.opacity > 0);

      // Continue animation if there are still particles
      if (this.particles.length > 0) {
        setTimeout(() => {
          requestAnimationFrame(animate);
        }, interval);
      }
    };

    animate();
  }

  getLeague(xp: number): string {
    if (xp < 10) return 'stone';
    if (xp < 25) return 'bronze';
    if (xp < 50) return 'silver';
    if (xp < 100) return 'gold';
    if (xp < 150) return 'saphire';
    if (xp < 250) return 'ruby';
    if (xp < 500) return 'emerald';
    return 'amethyst';
  }
}
