
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class AuthInput {
    clientToken: string;
    sessionId?: Nullable<string>;
}

export class AuthPayload {
    accessToken: string;
}

export abstract class IMutation {
    abstract signIn(data: AuthInput): AuthPayload | Promise<AuthPayload>;
}

export abstract class IQuery {
    abstract categories(): string[] | Promise<string[]>;

    abstract me(): User | Promise<User>;
}

export class User {
    id: string;
    email?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export type DateTime = any;
type Nullable<T> = T | null;
