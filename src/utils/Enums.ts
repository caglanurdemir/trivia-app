export enum TriviaSteps {
    Welcome,
    Questions,
    Results
}

export enum Direction {
    Next,
    Back
}

export enum ApiEndpoints {
    Easy = "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple",
    Medium = "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple",
    Hard = "https://opentdb.com/api.php?amount=10&difficulty=hard&type=multiple",
    Random = "https://opentdb.com/api.php?amount=10&type=multiple"
}

export enum Difficulty {
    Easy = "Easy",
    Medium = "Medium",
    Hard = "Hard",
    Random = "Random"
}

export enum QuestionSteps {
    SelectDifficulty,
    Play
}