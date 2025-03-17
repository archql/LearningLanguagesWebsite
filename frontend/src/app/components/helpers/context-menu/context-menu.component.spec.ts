import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuComponent } from './context-menu.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('ContextMenuComponent', () => {
  let component: ContextMenuComponent;
  let fixture: ComponentFixture<ContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
          ContextMenuComponent,
          TranslateModule.forRoot()
        ],
        providers: [
          TranslateService
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the context menu', () => {
    spyOn(component.menuTrigger, 'closeMenu');

    component.close();

    expect(component.menuTrigger.closeMenu).toHaveBeenCalled();
  });

  it('should handle right click event', () => {
    const event = new MouseEvent('contextmenu');
    spyOn(component, 'open');

    component.onRightClick(event);

    expect(component.open).toHaveBeenCalledWith(event);
  });

  it('should not open the context menu if no text is selected', () => {
    const event = new MouseEvent('contextmenu', { clientX: 100, clientY: 100 });
    spyOn(window, 'getSelection').and.returnValue({
      toString: () => ''
    } as any);
    spyOn(component.menuTrigger, 'openMenu');

    component.open(event);

    expect(component.menuTrigger.openMenu).not.toHaveBeenCalled();
  });

  it('should open the context menu if text is selected', () => {
    const event = new MouseEvent('contextmenu', { clientX: 100, clientY: 100 });
    spyOn(window, 'getSelection').and.returnValue({
      toString: () => 'selected text'
    } as any);
    spyOn(component.menuTrigger, 'openMenu');

    component.open(event);

    expect(component.menuTrigger.openMenu).toHaveBeenCalled();
  });

  it('should close the menu when clicking outside', () => {
    const event = new MouseEvent('click');
    spyOn(component, 'close');
    spyOnProperty(event, 'target').and.returnValue(document.createElement('div'));

    component.onClickOutside(event);

    expect(component.close).toHaveBeenCalled();
  });

  it('should not close the menu when clicking inside', () => {
    const event = new MouseEvent('click');
    spyOn(component, 'close');
    spyOnProperty(event, 'target').and.returnValue(fixture.nativeElement);

    component.onClickOutside(event);

    expect(component.close).not.toHaveBeenCalled();
  });
});
