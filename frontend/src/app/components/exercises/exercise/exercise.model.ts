export interface ExerciseBe {
    mcRange: number[],
    mcQuestions: string[],
    mcOptions: string[][],
    mcCorrectAnswers: string[],
    fbRange: number[],
    fbBeforeBlank: string[],
    fbAfterBlank: string[],
    fbCorrectAnswers: string[],
    mcGivenAnswers: string[],
    fbGivenAnswers: string[]
}