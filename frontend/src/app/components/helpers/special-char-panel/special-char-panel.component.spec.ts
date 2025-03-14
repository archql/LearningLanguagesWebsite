import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialCharPanelComponent } from './special-char-panel.component';

describe('SpecialCharPanelComponent', () => {
  let component: SpecialCharPanelComponent;
  let fixture: ComponentFixture<SpecialCharPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialCharPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialCharPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
