export interface VocabularyWord {
    word: string;
    meaning: string;
}
  
export interface VocabularyGroup {
    section: string;
    words: VocabularyWord[];
}