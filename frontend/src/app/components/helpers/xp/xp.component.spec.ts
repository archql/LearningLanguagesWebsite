import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XpComponent } from './xp.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('XpComponent', () => {
  let component: XpComponent;
  let fixture: ComponentFixture<XpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XpComponent, BrowserAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display XP gain correctly', () => {
    component.xpGain = true;
    component.displayXP = 100;
    fixture.detectChanges();
    const xpText = fixture.debugElement.query(By.css('.xp-text span')).nativeElement;
    expect(xpText.textContent).toContain('+100 XP');
  });

  it('should display league info when xpGain is false', () => {
    component.xpGain = false;
    component.league = 'gold';
    fixture.detectChanges();
    const leagueInfo = fixture.debugElement.query(By.css('.league-info .league-name')).nativeElement;
    expect(leagueInfo.textContent).toContain('Gold');
  });

  it('should display particles correctly', () => {
    component.particles = [
      { id: 1, x: 10, y: 20, opacity: 0.5 },
      { id: 2, x: 30, y: 40, opacity: 0.8 }
    ];
    fixture.detectChanges();
    const particles = fixture.debugElement.queryAll(By.css('.xp-particle'));
    expect(particles.length).toBe(2);
    expect(particles[0].nativeElement.style.left).toBe('10px');
    expect(particles[0].nativeElement.style.top).toBe('20px');
    expect(particles[0].nativeElement.style.opacity).toBe('0.5');
    expect(particles[1].nativeElement.style.left).toBe('30px');
    expect(particles[1].nativeElement.style.top).toBe('40px');
    expect(particles[1].nativeElement.style.opacity).toBe('0.8');
  });

  it('should handle empty particles array', () => {
    component.particles = [];
    fixture.detectChanges();
    const particles = fixture.debugElement.queryAll(By.css('.xp-particle'));
    expect(particles.length).toBe(0);
  });

  it('should handle zero XP value', () => {
    component.xpGain = true;
    component.displayXP = 0;
    fixture.detectChanges();
    const xpText = fixture.debugElement.query(By.css('.xp-text span')).nativeElement;
    expect(xpText.textContent).toContain('0 XP');
  });

  it('should set league based on xpAmount', () => {
    component.xpGain = false;
    component.xpAmount = 150;
    fixture.detectChanges();
    expect(component.league).toBe('ruby');
  });

  it('should animate XP correctly', (done) => {
    component.xpGain = true;
    component.xpAmount = 200;
    component.animateXP();
    setTimeout(() => {
      expect(component.displayXP).toBe(200);
      done();
    }, 2000);
  });

  it('should handle xpAmount less than 10', () => {
    component.xpGain = false;
    component.xpAmount = 5;
    fixture.detectChanges();
    expect(component.league).toBe('stone');
  });

  it('should handle xpAmount between 10 and 25', () => {
    component.xpGain = false;
    component.xpAmount = 20;
    fixture.detectChanges();
    expect(component.league).toBe('bronze');
  });

  it('should handle xpAmount between 25 and 50', () => {
    component.xpGain = false;
    component.xpAmount = 30;
    fixture.detectChanges();
    expect(component.league).toBe('silver');
  });

  it('should handle xpAmount between 50 and 100', () => {
    component.xpGain = false;
    component.xpAmount = 70;
    fixture.detectChanges();
    expect(component.league).toBe('gold');
  });

  it('should handle xpAmount between 100 and 150', () => {
    component.xpGain = false;
    component.xpAmount = 120;
    fixture.detectChanges();
    expect(component.league).toBe('saphire');
  });

  it('should handle xpAmount between 150 and 250', () => {
    component.xpGain = false;
    component.xpAmount = 200;
    fixture.detectChanges();
    expect(component.league).toBe('ruby');
  });

  it('should handle xpAmount between 250 and 500', () => {
    component.xpGain = false;
    component.xpAmount = 300;
    fixture.detectChanges();
    expect(component.league).toBe('emerald');
  });

  it('should handle xpAmount greater than 500', () => {
    component.xpGain = false;
    component.xpAmount = 600;
    fixture.detectChanges();
    expect(component.league).toBe('amethyst');
  });
});
