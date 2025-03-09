import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageComponent } from './home-page.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomePageComponent,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        TranslateService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jasmine.createSpy('get').and.returnValue('someParamValue'), // Mock paramMap.get
              },
            },
            queryParamMap: of({ get: (key: string) => 'someQueryParamValue' }), // Mock queryParamMap
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
            events: of(), // Mock Router.events as an observable
            url: '/', // Mock Router.url
            createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({}), // Mock createUrlTree
            serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue(''), // Mock serializeUrl
          },
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
