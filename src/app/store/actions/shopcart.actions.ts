import { Action } from '@ngrx/store';


export enum ShopcartActionTypes {
    PULL = '[shopCart] Pull',
    CLEAR = '[shopCart] Clear',

}

export class Push implements Action {
    readonly type = ShopcartActionTypes.PULL;
    constructor(public payload: any) { }
}

export class Clear implements Action {
    readonly type = ShopcartActionTypes.CLEAR;
    constructor(public payload: any) { }
}

export type All =
    | Push
    | Clear;
