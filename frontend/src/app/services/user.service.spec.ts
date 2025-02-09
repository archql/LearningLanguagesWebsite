import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { CulturalNote, DailyChallenge, UserProgress } from '../components/pages/dashboard-page/dashboard.model';
import { User } from '../components/pages/profile-page/user.model';
import { Topic } from '../components/teaching/lesson-selection/lesson-selection.model';
import { provideHttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return cultural note', () => {
    const mockCulturalNote: CulturalNote = { quote: 'Test quote', author: 'Test author' };

    service.getCulturalNote().subscribe(note => {
      expect(note).toEqual(mockCulturalNote);
    });

    const req = httpMock.expectOne('/api/user/cultural-note');
    expect(req.request.method).toBe('GET');
    req.flush(mockCulturalNote);
  });

  it('should handle error when getting cultural note', () => {
    service.getCulturalNote().subscribe(note => {
      expect(note).toBeNull();
    });

    const req = httpMock.expectOne('/api/user/cultural-note');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should return current user', () => {
    const mockUser: User = { id: 1, login: 'JohnDoe', email: 'johndoe@example.com', language: 'en' };

    service.getCurrentUser().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/user/current');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should handle error when getting current user', () => {
    service.getCurrentUser().subscribe(user => {
      expect(user).toBeNull();
    });

    const req = httpMock.expectOne('/api/user/current');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should return user progress', () => {
    const mockUserProgress: UserProgress = { completedLessons: 7, totalLessons: 20 };

    service.getUserProgress().subscribe(progress => {
      expect(progress).toEqual(mockUserProgress);
    });

    const req = httpMock.expectOne('/api/user/progress');
    expect(req.request.method).toBe('GET');
    req.flush(mockUserProgress);
  });

  it('should handle error when getting user progress', () => {
    service.getUserProgress().subscribe(progress => {
      expect(progress).toBeNull();
    });

    const req = httpMock.expectOne('/api/user/progress');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should return daily challenge', () => {
    const mockDailyChallenge: DailyChallenge = { isCompleted: false };

    service.getDailyChallenge().subscribe(challenge => {
      expect(challenge).toEqual(mockDailyChallenge);
    });

    const req = httpMock.expectOne('/api/user/daily-challenge');
    expect(req.request.method).toBe('GET');
    req.flush(mockDailyChallenge);
  });

  it('should handle error when getting daily challenge', () => {
    service.getDailyChallenge().subscribe(challenge => {
      expect(challenge).toBeNull();
    });

    const req = httpMock.expectOne('/api/user/daily-challenge');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should return user topics', () => {
    const mockTopics: Topic[] = [{ title: 'Topic 1', lessons: [] }];

    service.getUserTopics().subscribe(topics => {
      expect(topics).toEqual(mockTopics);
    });

    const req = httpMock.expectOne('/api/user/topics');
    expect(req.request.method).toBe('GET');
    req.flush(mockTopics);
  });

  it('should handle error when getting user topics', () => {
    service.getUserTopics().subscribe(topics => {
      expect(topics).toBeNull();
    });

    const req = httpMock.expectOne('/api/user/topics');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should change learning language', () => {
    service.changeLearningLanguage('fr').subscribe(response => {
      expect(response).toBeTrue();
    });

    const req = httpMock.expectOne('/api/user/language');
    expect(req.request.method).toBe('POST');
    req.flush(true);
  });

  it('should handle error when changing learning language', () => {
    service.changeLearningLanguage('fr').subscribe(response => {
      expect(response).toBeFalse();
    });

    const req = httpMock.expectOne('/api/user/language');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should reset progress', () => {
    service.resetProgress().subscribe(response => {
      expect(response).toBeTrue();
    });

    const req = httpMock.expectOne('/api/user/reset');
    expect(req.request.method).toBe('POST');
    req.flush(true);
  });

  it('should handle error when resetting progress', () => {
    service.resetProgress().subscribe(response => {
      expect(response).toBeFalse();
    });

    const req = httpMock.expectOne('/api/user/reset');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should upload vocabulary', () => {
    const mockFile = new File([''], 'filename', { type: 'text/yaml' });

    service.uploadVocabulary(mockFile).subscribe(response => {
      expect(response).toBeTrue();
    });

    const req = httpMock.expectOne('/api/user/vocabulary');
    expect(req.request.method).toBe('POST');
    req.flush(true);
  });

  it('should handle error when uploading vocabulary', () => {
    const mockFile = new File([''], 'filename', { type: 'text/yaml' });

    service.uploadVocabulary(mockFile).subscribe(response => {
      expect(response).toBeFalse();
    });

    const req = httpMock.expectOne('/api/user/vocabulary');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should download vocabulary', () => {
    const mockBlob = new Blob(['mock vocabulary content'], { type: 'text/yaml' });

    service.downloadVocabulary().subscribe(blob => {
      expect(blob).toEqual(mockBlob);
    });

    const req = httpMock.expectOne('/api/user/vocabulary');
    expect(req.request.method).toBe('GET');
    req.flush(mockBlob);
  });

  // it('should handle error when downloading vocabulary', () => {
  //   service.downloadVocabulary().subscribe(blob => {
  //     expect(blob).toBeNull();
  //   });

  //   const req = httpMock.expectOne('/api/user/vocabulary');
  //   req.flush('Error', { status: 500, statusText: 'Server Error' });
  // });
});
