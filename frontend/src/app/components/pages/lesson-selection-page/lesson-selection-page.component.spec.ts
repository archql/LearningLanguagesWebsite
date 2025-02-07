import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonSelectionPageComponent } from './lesson-selection-page.component';

describe('LessonSelectionPageComponent', () => {
  let component: LessonSelectionPageComponent;
  let fixture: ComponentFixture<LessonSelectionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonSelectionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonSelectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
