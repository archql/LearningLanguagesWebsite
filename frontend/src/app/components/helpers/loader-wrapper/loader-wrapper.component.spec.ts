import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderWrapperComponent } from './loader-wrapper.component';

describe('LoaderWrapperComponent', () => {
  let component: LoaderWrapperComponent;
  let fixture: ComponentFixture<LoaderWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should hide spinner and show content when loading is false', () => {
    component.loading = false;
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    const content = fixture.nativeElement.querySelector('.test-stub');
    expect(spinner).toBeFalsy();
    expect(content).toBeTruthy();
  });
});
