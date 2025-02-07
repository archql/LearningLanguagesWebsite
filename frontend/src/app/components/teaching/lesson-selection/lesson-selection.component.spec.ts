import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonSelectionComponent } from './lesson-selection.component';

describe('LessonSelectionComponent', () => {
  let component: LessonSelectionComponent;
  let fixture: ComponentFixture<LessonSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
