import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuBarComponent } from './menu-bar.component';
import { MenuItem } from './menu-bar.model';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MenuBarComponent', () => {
  let component: MenuBarComponent;
  let fixture: ComponentFixture<MenuBarComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatButtonModule,
        TranslateModule.forRoot(),
        MenuBarComponent,
        LanguageSelectorComponent,
        BrowserAnimationsModule
      ],
      providers: [
        TranslateService, 
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuBarComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize menu items with translation IDs', () => {
    const menuItems: MenuItem[] = [
      { trID: 'home', label: '', link: '/home' },
      { trID: 'about', label: '', link: '/about' }
    ];
    component.menuItems = menuItems;
    component.ngOnInit();

    expect(component.menuItems[0].trID).toBe('app.menu-bar.home');
    expect(component.menuItems[1].trID).toBe('app.menu-bar.about');
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component['subscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['subscription'].unsubscribe).toHaveBeenCalled();
  });

  it('should change language on language selection', () => {
    spyOn(translateService, 'use');
    const language = { code: 'en', name: 'English', flagIcon: '' };
    component.onLanguageSelected(language);
    expect(translateService.use).toHaveBeenCalledWith('en');
  });
});
