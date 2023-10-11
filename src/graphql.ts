
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum ProgressStatus {
    INITED = "INITED",
    INITFAIL = "INITFAIL",
    COMPLETE = "COMPLETE",
    PENDING = "PENDING"
}

export enum QuestionType {
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
    FILL_IN_THE_BLANK_WITH_OPTIONS = "FILL_IN_THE_BLANK_WITH_OPTIONS",
    TRUE_FALSE = "TRUE_FALSE",
    FILL_IN_THE_BLANK_FREE_TEXT = "FILL_IN_THE_BLANK_FREE_TEXT",
    ESSAY = "ESSAY"
}

export enum Difficulty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD"
}

export class AuthInput {
    clientToken: string;
    sessionId: string;
}

export class CreateAudienceInput {
    ageStart: number;
    ageEnd: number;
    level: string;
    desc?: Nullable<string>;
}

export class CreatePerformanceTaskInput {
    objectives: string;
    description?: Nullable<string>;
    tone: string;
    modality: string;
    language?: Nullable<string>;
    audience: CreateAudienceInput;
}

export class UpdatePerformanceTaskInput {
    objectives?: Nullable<string>;
    description?: Nullable<string>;
    tone?: Nullable<string>;
    modality?: Nullable<string>;
    language?: Nullable<string>;
    audience?: Nullable<CreateAudienceInput>;
}

export class CreateQuestionInput {
    content: string;
    type: QuestionType;
    difficulty: Difficulty;
    answers: AnswerInput[];
}

export class AnswerInput {
    content: string;
    isCorrect: boolean;
}

export class TaxonomyInput {
    difficulty: Difficulty;
    quantity: number;
}

export class CreateQuizInput {
    objectives: string;
    description?: Nullable<string>;
    tone: string;
    modality: string;
    language?: Nullable<string>;
    audience: CreateAudienceInput;
    questionTypes: QuestionType[];
    taxonomies?: Nullable<TaxonomyInput[]>;
    questions?: Nullable<CreateQuestionInput[]>;
}

export class CreateWorksheetInput {
    objectives: string;
    description?: Nullable<string>;
    tone: string;
    modality: string;
    language?: Nullable<string>;
    audience: CreateAudienceInput;
    questionTypes: QuestionType[];
    taxonomies?: Nullable<TaxonomyInput[]>;
    questions?: Nullable<CreateQuestionInput[]>;
}

export class AuthPayload {
    accessToken: string;
}

export abstract class IMutation {
    abstract signIn(data: AuthInput): AuthPayload | Promise<AuthPayload>;

    abstract createPerformanceTask(data: CreatePerformanceTaskInput): Nullable<RespondPerformanceTask> | Promise<Nullable<RespondPerformanceTask>>;

    abstract removePerformanceTask(id: string): Nullable<RespondPerformanceTask> | Promise<Nullable<RespondPerformanceTask>>;

    abstract createQuiz(data: CreateQuizInput): Nullable<RespondQuiz> | Promise<Nullable<RespondQuiz>>;

    abstract removeQuiz(id: string): Nullable<RespondQuiz> | Promise<Nullable<RespondQuiz>>;

    abstract createWorksheet(data: CreateWorksheetInput): Nullable<RespondWorksheet> | Promise<Nullable<RespondWorksheet>>;

    abstract removeWorksheet(id: string): Nullable<RespondWorksheet> | Promise<Nullable<RespondWorksheet>>;
}

export abstract class IQuery {
    abstract categories(): string[] | Promise<string[]>;

    abstract performanceTasks(): Nullable<RespondPerformanceTask>[] | Promise<Nullable<RespondPerformanceTask>[]>;

    abstract performanceTask(id: string): RespondPerformanceTask | Promise<RespondPerformanceTask>;

    abstract quizzes(): Nullable<RespondQuiz>[] | Promise<Nullable<RespondQuiz>[]>;

    abstract quiz(id: string): RespondQuiz | Promise<RespondQuiz>;

    abstract me(): User | Promise<User>;

    abstract worksheets(): Nullable<RespondWorksheet>[] | Promise<Nullable<RespondWorksheet>[]>;

    abstract worksheet(id: string): RespondWorksheet | Promise<RespondWorksheet>;
}

export class PerformanceTask {
    objectives: string;
    description?: Nullable<string>;
    tone: string;
    modality: string;
    language?: Nullable<string>;
    audience: Audience;
}

export class Audience {
    ageStart: number;
    ageEnd: number;
    level: string;
    desc?: Nullable<string>;
}

export class RespondPerformanceTask {
    id: string;
    userId?: Nullable<string>;
    request?: Nullable<PerformanceTask>;
    result?: Nullable<JSON>;
    createdDate?: Nullable<DateTime>;
    updatedDate?: Nullable<DateTime>;
    progressPercent?: Nullable<number>;
    progressStatus: ProgressStatus;
}

export class Question {
    content: string;
    type: QuestionType;
    difficulty: Difficulty;
    answers: Answer[];
}

export class Answer {
    content: string;
    isCorrect: boolean;
}

export class Taxonomy {
    difficulty: Difficulty;
    quantity: number;
}

export class Quiz {
    objectives: string;
    description?: Nullable<string>;
    tone: string;
    modality: string;
    language?: Nullable<string>;
    audience: Audience;
    questionTypes: QuestionType[];
    taxonomies: Taxonomy[];
    questions: Question[];
}

export class RespondQuiz {
    id: string;
    userId?: Nullable<string>;
    request?: Nullable<Quiz>;
    result?: Nullable<JSON>;
    createdDate?: Nullable<DateTime>;
    updatedDate?: Nullable<DateTime>;
    progressPercent?: Nullable<number>;
    progressStatus: ProgressStatus;
}

export class User {
    id: string;
    email?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
}

export class Worksheet {
    objectives: string;
    description?: Nullable<string>;
    tone: string;
    modality: string;
    language?: Nullable<string>;
    audience: Audience;
    questionTypes: QuestionType[];
    taxonomies: Taxonomy[];
    questions: Question[];
}

export class RespondWorksheet {
    id: string;
    userId?: Nullable<string>;
    request?: Nullable<Worksheet>;
    result?: Nullable<JSON>;
    createdDate?: Nullable<DateTime>;
    updatedDate?: Nullable<DateTime>;
    progressPercent?: Nullable<number>;
    progressStatus: ProgressStatus;
}

export type DateTime = any;
export type JSON = any;
type Nullable<T> = T | null;
