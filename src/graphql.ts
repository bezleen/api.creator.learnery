
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class AuthInput {
    email: string;
    password: string;
}

export class CreateCourseInput {
    exampleField?: Nullable<number>;
}

export class UpdateCourseInput {
    id: number;
}

export class AuthPayload {
    access_token: string;
}

export class SignUpPayload {
    id: number;
    email: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export abstract class IMutation {
    abstract signUp(data: AuthInput): SignUpPayload | Promise<SignUpPayload>;

    abstract signIn(data: AuthInput): AuthPayload | Promise<AuthPayload>;

    abstract createCourse(createCourseInput: CreateCourseInput): Course | Promise<Course>;

    abstract updateCourse(updateCourseInput: UpdateCourseInput): Course | Promise<Course>;

    abstract removeCourse(id: number): Nullable<Course> | Promise<Nullable<Course>>;
}

export class Course {
    exampleField?: Nullable<number>;
}

export abstract class IQuery {
    abstract courses(): Nullable<Course>[] | Promise<Nullable<Course>[]>;

    abstract course(id: number): Nullable<Course> | Promise<Nullable<Course>>;

    abstract me(): User | Promise<User>;
}

export class User {
    id: number;
    email: string;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export type DateTime = any;
type Nullable<T> = T | null;
