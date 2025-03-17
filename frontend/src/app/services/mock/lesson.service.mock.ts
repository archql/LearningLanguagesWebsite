import { Injectable } from '@angular/core';
import { Topic } from '../../components/teaching/lesson-selection/lesson-selection.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessonServiceMock {

    constructor() { }

    getTopics(): Observable<Topic[]> {
        const topics: Topic[] = [
            {
            title: 'Topic 1',
            lessons: [
                { id: 1, title: 'Lesson 1.1', route: '/lesson/1.1', completed: true, score: 1 },
                { id: 2, title: 'Lesson 1.2', route: '/lesson/1.2', completed: false, score: 0 },
            ],
            },
            {
            title: 'Topic 2',
            lessons: [
                { id: 3, title: 'Lesson 2.1', route: '/lesson/2.1', completed: true, score: 0 },
                { id: 4, title: 'Lesson 2.2', route: '/lesson/2.2', completed: true, score: 0 },
            ],
            },
            {
            title: 'Topic 3',
            lessons: [
                { id: 5, title: 'Lesson 3.1', route: '/lesson/2.1', completed: true, score: 0 },
                { id: 6, title: 'Lesson 3.2', route: '/lesson/2.2', completed: true, score: 0 },
            ],
            },
        ];
        for (let i = 7; i < 105; i++) {
            const lessonNumber = i - 2;
            const routeNumber = i - 3;
            topics[2].lessons.push({
            id: i,
            title: `Lesson 3.${lessonNumber}`,
            route: `/lesson/3.${routeNumber}`,
            completed: false,
            score: 0
            });
        }
    
        // Calculate completion percentage for each topic
        const updatedTopics = topics.map((topic) => {
            const completedLessons = topic.lessons.filter((lesson) => lesson.completed).length;
            topic.completionPercentage = (completedLessons / topic.lessons.length) * 100;
            return topic;
        });

        return of(updatedTopics);
    }
}
