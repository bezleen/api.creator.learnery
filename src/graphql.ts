
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateAudienceInput {
    ageStart: number;
    ageEnd: number;
    level: string;
}

export class UpdateAudienceInput {
    ageStart?: Nullable<number>;
    ageEnd?: Nullable<number>;
    level?: Nullable<string>;
}

export class AuthInput {
    clientToken: string;
    sessionId: string;
}

export class CreateCourse {
  title: string
  objective: string
  description: string
  language?: Nullable<string>
  category: string
  tone: string
  modality: string
  classSize: string
  topics?: Nullable<string[]>
  duration: number
  durationLesson: number
  audienceId: string
}

export class UpdateCourse {
    title?: Nullable<string>;
    objective?: Nullable<string>;
    description?: Nullable<string>;
    language?: Nullable<string>;
    category?: Nullable<string>;
    tone?: Nullable<string>;
    modality?: Nullable<string>;
    classSize?: Nullable<string>;
    topics?: Nullable<string[]>;
    duration?: Nullable<number>;
    durationLesson?: Nullable<number>;
}

export class Audience {
    id: string;
    ageStart: number;
    ageEnd: number;
    level: string;
}

export abstract class IQuery {
    abstract audience(id: string): Nullable<Audience> | Promise<Nullable<Audience>>;

    abstract audiences(): Audience[] | Promise<Audience[]>;

    abstract categories(): string[] | Promise<string[]>;

    abstract courses(): Nullable<Course>[] | Promise<Nullable<Course>[]>;

    abstract course(id: string): Course | Promise<Course>;

    abstract me(): User | Promise<User>;
}

export abstract class IMutation {
  abstract createAudience(data: CreateAudienceInput): Audience | Promise<Audience>

  abstract updateAudience(
    id: string,
    data: UpdateAudienceInput,
  ): Audience | Promise<Audience>

  abstract removeAudience(id: string): Nullable<Audience> | Promise<Nullable<Audience>>

  abstract signIn(data: AuthInput): AuthPayload | Promise<AuthPayload>

  abstract createCourse(data: CreateCourse): Nullable<Course> | Promise<Nullable<Course>>

  abstract updateCourse(id: string, data: UpdateCourse): Course | Promise<Course>

  abstract deleteCourse(id: string): Nullable<Course> | Promise<Nullable<Course>>
}

export class AuthPayload {
    accessToken: string;
}

export class Course {
  id: string
  title: string
  objective: string
  description: string
  language?: Nullable<string>
  category: string
  tone: string
  modality: string
  classSize: string
  topics?: Nullable<string[]>
  duration: number
  durationLesson: number
  creatorId: string
  createdAt: DateTime
  updatedAt: DateTime
}

export class User {
    id: string;
    email?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
}

export type DateTime = any;
type Nullable<T> = T | null;
