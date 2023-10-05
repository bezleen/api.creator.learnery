
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

export class CreateCourse {
    description: string;
    language?: Nullable<string>;
    category: string;
    tone: string;
    modality: string;
    classSize: string;
    topics?: Nullable<Nullable<string>[]>;
    duration: number;
    durationLesson: number;
    audience: CreateAudienceInput;
}

export class UpdateCourse {
    title?: Nullable<string>;
    objective?: Nullable<string[]>;
    description?: Nullable<string>;
    language?: Nullable<string>;
    category?: Nullable<string>;
    tone?: Nullable<string>;
    modality?: Nullable<string>;
    classSize?: Nullable<string>;
    topics?: Nullable<string[]>;
    duration?: Nullable<number>;
    durationLesson?: Nullable<number>;
    audience?: Nullable<CreateAudienceInput>;
    outline?: Nullable<UpdateCourseOutline>;
    detailedOutline?: Nullable<UpdateCourseDetailedOutline>;
}

export class CreateCourseTitle {
    courseId: string;
}

export class CreateCourseObjective {
    courseId: string;
}

export class CreateCourseOutline {
    courseId: string;
}

export class UpdateCourseOutline {
    courseDuration: string;
    inScope: InputTopic[];
    outOfScope: InputTopic[];
    explanation?: Nullable<string>;
}

export class UpdateCourseDetailedOutline {
    sections: UpdateDetailedOutlineSectionInput[];
    objectiveTopicConnections: UpdateDetailedOutlineObjectiveInput[];
    summary: CourseDetailedSummaryInput;
    rationale: string;
}

export class DetailedOutlineTopicInput {
    title: string;
    onScreenContent: string;
    topicDescription: string;
    detailedCoverage: string;
    resources: string;
    connection: string[];
    timingMins: number;
}

export class UpdateDetailedOutlineSectionInput {
    title: string;
    topics?: Nullable<DetailedOutlineTopicInput[]>;
}

export class UpdateDetailedOutlineObjectiveInput {
    objective: string;
    topics?: Nullable<string[]>;
}

export class CourseDetailedSummaryInput {
    totalSections: number;
    totalTopics: number;
    courseHours: number;
}

export class InputTopic {
    topic: string;
    subtopics: Nullable<string>[];
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

export class UpdateQuizInput {
    objectives?: Nullable<string>;
    description?: Nullable<string>;
    tone?: Nullable<string>;
    modality?: Nullable<string>;
    language?: Nullable<string>;
    audience?: Nullable<CreateAudienceInput>;
    questionTypes?: Nullable<QuestionType[]>;
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

export class UpdateWorksheetInput {
    objectives?: Nullable<string>;
    description?: Nullable<string>;
    tone?: Nullable<string>;
    modality?: Nullable<string>;
    language?: Nullable<string>;
    audience?: Nullable<CreateAudienceInput>;
    questionTypes?: Nullable<QuestionType[]>;
    taxonomies?: Nullable<TaxonomyInput[]>;
    questions?: Nullable<CreateQuestionInput[]>;
}

export class AuthPayload {
    accessToken: string;
}

export abstract class IMutation {
    abstract signIn(data: AuthInput): AuthPayload | Promise<AuthPayload>;

    abstract createCourse(data: CreateCourse): Nullable<Course> | Promise<Nullable<Course>>;

    abstract updateCourse(id: string, data: UpdateCourse): Course | Promise<Course>;

    abstract deleteCourse(id: string): Nullable<Course> | Promise<Nullable<Course>>;

    abstract createCourseTitle(courseId: string): Nullable<GeneratedCourseTitle>[] | Promise<Nullable<GeneratedCourseTitle>[]>;

    abstract createCourseObjective(courseId: string): Nullable<GeneratedCourseObjective>[] | Promise<Nullable<GeneratedCourseObjective>[]>;

    abstract createCourseOutline(courseId: string): CourseOutline | Promise<CourseOutline>;

    abstract createCourseDetailedOutline(courseId: string): CourseDetailedOutline | Promise<CourseDetailedOutline>;

    abstract createPerformanceTask(data: CreatePerformanceTaskInput): Nullable<PerformanceTask> | Promise<Nullable<PerformanceTask>>;

    abstract updatePerformanceTask(id: string, data: UpdatePerformanceTaskInput): PerformanceTask | Promise<PerformanceTask>;

    abstract removePerformanceTask(id: string): Nullable<PerformanceTask> | Promise<Nullable<PerformanceTask>>;

    abstract createQuiz(data: CreateQuizInput): Nullable<Quiz> | Promise<Nullable<Quiz>>;

    abstract updateQuiz(id: string, data: UpdateQuizInput): Quiz | Promise<Quiz>;

    abstract removeQuiz(id: string): Nullable<Quiz> | Promise<Nullable<Quiz>>;

    abstract createWorksheet(data: CreateWorksheetInput): Nullable<Worksheet> | Promise<Nullable<Worksheet>>;

    abstract updateWorksheet(id: string, data: UpdateWorksheetInput): Worksheet | Promise<Worksheet>;

    abstract removeWorksheet(id: string): Nullable<Worksheet> | Promise<Nullable<Worksheet>>;
}

export abstract class IQuery {
    abstract categories(): string[] | Promise<string[]>;

    abstract courses(): Nullable<Course>[] | Promise<Nullable<Course>[]>;

    abstract course(id: string): Course | Promise<Course>;

    abstract performanceTasks(): Nullable<PerformanceTask>[] | Promise<Nullable<PerformanceTask>[]>;

    abstract performanceTask(id: string): PerformanceTask | Promise<PerformanceTask>;

    abstract quizzes(): Nullable<Quiz>[] | Promise<Nullable<Quiz>[]>;

    abstract quiz(id: string): Nullable<Quiz> | Promise<Nullable<Quiz>>;

    abstract me(): User | Promise<User>;

    abstract worksheets(): Nullable<Worksheet>[] | Promise<Nullable<Worksheet>[]>;

    abstract worksheet(id: string): Worksheet | Promise<Worksheet>;
}

export class Course {
    id?: Nullable<string>;
    title?: Nullable<string>;
    objective?: Nullable<string[]>;
    description: string;
    language?: Nullable<string>;
    category: string;
    tone: string;
    modality: string;
    classSize: string;
    topics?: Nullable<string[]>;
    duration: number;
    durationLesson: number;
    creatorId: string;
    outline?: Nullable<CourseOutline>;
    detailedOutline?: Nullable<CourseDetailedOutline>;
    createdAt: DateTime;
    updatedAt: DateTime;
    audience: Audience;
}

export class Audience {
    ageStart: number;
    ageEnd: number;
    level: string;
    desc?: Nullable<string>;
}

export class GeneratedCourseTitle {
    title: string;
    reason?: Nullable<string>;
}

export class GeneratedCourseObjective {
    objective: string;
    outcome?: Nullable<string>;
}

export class CourseOutline {
    courseDuration: string;
    inScope: Topic[];
    outOfScope: Topic[];
    explanation?: Nullable<string>;
}

export class CourseDetailedOutline {
    sections: DetailedOutlineSection[];
    objectiveTopicConnections: DetailedOutlineObjective[];
    summary: CourseDetailedSummary;
    rationale: string;
}

export class DetailedOutlineSection {
    title: string;
    topics: Nullable<DetailedOutlineTopic>[];
}

export class DetailedOutlineTopic {
    title: string;
    onScreenContent: string;
    topicDescription: string;
    detailedCoverage: string;
    resources: string;
    connection: string[];
    timingMins: number;
}

export class DetailedOutlineObjective {
    objective: string;
    topics?: Nullable<string[]>;
}

export class CourseDetailedSummary {
    totalSections: number;
    totalTopics: number;
    courseHours: number;
}

export class Topic {
    topic: string;
    subtopics: string[];
}

export abstract class ISubscription {
    abstract courseUpdated(courseId: string): Course | Promise<Course>;
}

export class PerformanceTask {
    id: string;
    objectives: string;
    description?: Nullable<string>;
    tone: string;
    modality: string;
    language?: Nullable<string>;
    audience: Audience;
    createdAt: DateTime;
    updatedAt: DateTime;
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
    id: string;
    objectives: string;
    description?: Nullable<string>;
    tone: string;
    modality: string;
    language?: Nullable<string>;
    audience: Audience;
    questionTypes: QuestionType[];
    taxonomies: Taxonomy[];
    questions: Question[];
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class User {
    id: string;
    email?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
}

export class Worksheet {
    id: string;
    objectives: string;
    description?: Nullable<string>;
    tone: string;
    modality: string;
    language?: Nullable<string>;
    audience: Audience;
    questionTypes: QuestionType[];
    taxonomies: Taxonomy[];
    questions: Question[];
    createdAt: DateTime;
    updatedAt: DateTime;
}

export type DateTime = any;
type Nullable<T> = T | null;
