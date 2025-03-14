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
});
