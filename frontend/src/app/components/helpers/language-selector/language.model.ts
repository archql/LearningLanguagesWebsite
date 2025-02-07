// src/app/language-selector/language.model.ts
export interface Language {
    code: string; // Language code (e.g., 'en', 'fr')
    name: string; // Language name (e.g., 'English', 'French')
    flagIcon: string; // Flag icon (e.g., '🇺🇸', '🇫🇷')
    trID?: string;
}