
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

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

export enum ProgressStatus {
    INITED = "INITED",
    INITFAIL = "INITFAIL",
    COMPLETE = "COMPLETE",
    PENDING = "PENDING"
}

export enum MaterialType {
    QUIZ = "QUIZ",
    WORKSHEET = "WORKSHEET",
    PERFORMANCE_TASK = "PERFORMANCE_TASK"
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

export class DifficultyDistributionInput {
    difficulty: Difficulty;
    numberOfQuestions: number;
}

export class TypeQuestionInput {
    type: QuestionType;
    totalQuestions: number;
    bloomTaxonomy?: Nullable<DifficultyDistributionInput[]>;
}

export class CreateQuizInput {
    objectives: string;
    description?: Nullable<string>;
    tone: string;
    modality: string;
    language?: Nullable<string>;
    audience: CreateAudienceInput;
    questionTypes: TypeQuestionInput[];
}

export class CreateWorksheetInput {
    objectives: string;
    description?: Nullable<string>;
    tone: string;
    modality: string;
    language?: Nullable<string>;
    audience: CreateAudienceInput;
    questionTypes: TypeQuestionInput[];
}

export class CreatePerformanceTaskInput {
    objectives: string;
    description?: Nullable<string>;
    tone: string;
    modality: string;
    language?: Nullable<string>;
    audience: CreateAudienceInput;
}

export class CreateMaterialQuizInput {
    userId?: Nullable<string>;
    request: CreateQuizInput;
    progressPercent?: Nullable<number>;
    progressStatus: ProgressStatus;
}

export class CreateMaterialPerformanceTaskInput {
    userId?: Nullable<string>;
    request: CreatePerformanceTaskInput;
    progressPercent?: Nullable<number>;
    progressStatus: ProgressStatus;
}

export class CreateMaterialWorksheetInput {
    userId?: Nullable<string>;
    request: CreateWorksheetInput;
    progressPercent?: Nullable<number>;
    progressStatus: ProgressStatus;
}

export class AuthPayload {
    accessToken: string;
}

export abstract class IMutation {
    abstract signIn(data: AuthInput): AuthPayload | Promise<AuthPayload>;

    abstract createMaterialQuiz(data: CreateMaterialQuizInput): Material | Promise<Material>;

    abstract createMaterialPerformanceTask(data: CreateMaterialPerformanceTaskInput): Material | Promise<Material>;

    abstract createMaterialWorksheet(data: CreateMaterialWorksheetInput): Material | Promise<Material>;

    abstract removeMaterial(id: string): Nullable<Material> | Promise<Nullable<Material>>;
}

export abstract class IQuery {
    abstract categories(): string[] | Promise<string[]>;

    abstract materials(): Nullable<Material>[] | Promise<Nullable<Material>[]>;

    abstract material(id: string): Material | Promise<Material>;

    abstract me(): User | Promise<User>;
}

export class DifficultyDistribution {
    difficulty: Difficulty;
    numberOfQuestions: number;
}

export class Audience {
    ageStart: number;
    ageEnd: number;
    level: string;
    desc?: Nullable<string>;
}

export class TypeQuestion {
    type: QuestionType;
    totalQuestions: number;
    bloomTaxonomy?: Nullable<DifficultyDistribution[]>;
}

export class Quiz {
    objectives: string;
    description?: Nullable<string>;
    tone: string;
    modality: string;
    language?: Nullable<string>;
    audience: Audience;
    questionTypes: TypeQuestion[];
}

export class Worksheet {
    objectives: string;
    description?: Nullable<string>;
    tone: string;
    modality: string;
    language?: Nullable<string>;
    audience: Audience;
    questionTypes: TypeQuestion[];
}

export class PerformanceTask {
    objectives: string;
    description?: Nullable<string>;
    tone: string;
    modality: string;
    language?: Nullable<string>;
    audience: Audience;
}

export class RequestType {
    quiz?: Nullable<Quiz>;
    performanceTask?: Nullable<PerformanceTask>;
    worksheet?: Nullable<Worksheet>;
}

export class Material {
    id: string;
    userId?: Nullable<string>;
    type?: Nullable<MaterialType>;
    request?: Nullable<RequestType>;
    rawResult?: Nullable<string>;
    result?: Nullable<JSON>;
    startDate?: Nullable<DateTime>;
    endDate?: Nullable<DateTime>;
    runDuration?: Nullable<number>;
    waitDuration?: Nullable<number>;
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

export type DateTime = any;
export type JSON = any;
type Nullable<T> = T | null;
