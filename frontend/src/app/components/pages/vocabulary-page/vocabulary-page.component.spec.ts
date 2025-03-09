import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyPageComponent } from './vocabulary-page.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('VocabularyPageComponent', () => {
  let component: VocabularyPageComponent;
  let fixture: ComponentFixture<VocabularyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VocabularyPageComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TranslateService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VocabularyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
