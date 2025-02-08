export interface Language {
    code: string; // Language code (e.g., 'en', 'fr')
    name: string; // Language name (e.g., 'English', 'French')
    flagIcon: string; // Flag icon (e.g., '🇺🇸', '🇫🇷')
    trID?: string;
}

export const InterfaceLanguages : Language[] = [
    { code: 'en', name: 'English', flagIcon: '🇺🇸🇬🇧' },
    { code: 'de', name: 'German', flagIcon: '🇩🇪' },
    { code: 'by', name: 'Belarusian', flagIcon: '🇧🇾' },
    { code: 'ru', name: 'Russian', flagIcon: '🇷🇺' },
];

export const LearningLanguages : Language[] = [
    { code: 'en', name: 'English', flagIcon: '🇺🇸🇬🇧' },
    { code: 'de', name: 'German', flagIcon: '🇩🇪' },
];