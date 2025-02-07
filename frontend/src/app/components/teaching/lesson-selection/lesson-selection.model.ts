// src/app/lesson-list/lesson-list.model.ts
export interface Lesson {
    id: number;
    title: string;
    route: string;
    completed?: boolean; // Add this to track lesson completion
  }
  
  export interface Topic {
    title: string;
    lessons: Lesson[];
    completionPercentage?: number; // Add this for completion percentage
  }