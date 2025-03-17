import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FloatingProgressMeterComponent } from './floating-progress-meter.component';


describe('FloatingProgressMeterComponent', () => {
  let component: FloatingProgressMeterComponent;
  let fixture: ComponentFixture<FloatingProgressMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingProgressMeterComponent]  // Use standalone component import
    }).compileComponents();

    fixture = TestBed.createComponent(FloatingProgressMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a default progress of 0', () => {
    expect(component.progress).toBe(0);
  });

  it('should update progress when changeProgress() is called', () => {
    component.changeProgress(50);
    expect(component.progress).toBe(50);
  });

  it('should render the progress value correctly in the template', () => {
    component.changeProgress(75);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.progress-text')?.textContent).toContain('75%');
  });

});
