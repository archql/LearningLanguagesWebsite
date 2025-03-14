import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/auth/login-page/login-page.component';
import { MainPageComponent } from './components/pages/main-page/main-page.component';
import { ProfilePageComponent } from './components/pages/profile-page/profile-page.component';
import { loginGuard } from './guards/login.guard';
import { LessonSelectionPageComponent } from './components/pages/lesson-selection-page/lesson-selection-page.component';
import { DashboardPageComponent } from './components/pages/dashboard-page/dashboard-page.component';
import { VocabularyPageComponent } from './components/pages/vocabulary-page/vocabulary-page.component';
import { ErrorComponent } from './components/helpers/error/error.component';
import { RegisterPageComponent } from './components/auth/register-page/register-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { MainComponent } from './components/helpers/main/main.component';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { LessonPageComponent } from './components/pages/lesson-page/lesson-page.component';
import { lessonGuard } from './guards/lesson.guard';
import { FaqPageComponent } from './components/pages/faq-page/faq-page.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { 
        path: 'main', 
        component: MainPageComponent,
        children: [
            { path: 'login', component: LoginPageComponent },
            { path: 'register', component: RegisterPageComponent },
            { path: '**', pathMatch: 'full', component: MainComponent },
          ],
    },
    {
      path: 'home',
      component: HomePageComponent,
      canActivate: [loginGuard], // Protect this route
      children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'profile', component: ProfilePageComponent} ,
        { path: 'faq', component: FaqPageComponent} ,
        { path: 'lessons', component: LessonSelectionPageComponent} ,
        { path: 'dashboard', component: DashboardPageComponent },
        { path: 'vocabulary', component: VocabularyPageComponent },
        { path: 'lesson/:id', component: LessonPageComponent, canDeactivate: [CanDeactivateGuard], canActivate: [lessonGuard] },
      ],
    },
    { path: '**', pathMatch: 'full', component: ErrorComponent}, // catch all
];
