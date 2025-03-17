import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpecialCharPanelComponent } from './special-char-panel.component';
import { By } from '@angular/platform-browser';


describe('SpecialCharPanelComponent', () => {
  let component: SpecialCharPanelComponent;
  let fixture: ComponentFixture<SpecialCharPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialCharPanelComponent]  // Use standalone component import
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialCharPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render all special character buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(component.specialChars.length);
    buttons.forEach((button, index) => {
      expect(button.nativeElement.textContent.trim()).toBe(component.specialChars[index]);
    });
  });

  it('should emit charSelected event when a button is clicked', () => {
    spyOn(component.charSelected, 'emit');
    const charButton = fixture.debugElement.queryAll(By.css('button'))[0];
    charButton.nativeElement.click();
    expect(component.charSelected.emit).toHaveBeenCalledWith(component.specialChars[0]);
  });
});
