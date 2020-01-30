import { Action } from '@ngrx/store';
import { initialState } from '../auth/auth.reducers';


export enum ShopcartActionTypes {
    PUSH = '[shopCart] Push',
    CLEAR = '[shopCart] Clear',

}

export class Push implements Action {
    readonly type = ShopcartActionTypes.PUSH;
    constructor(public payload: any) { }
}

export class Clear implements Action {
    readonly type = ShopcartActionTypes.CLEAR;
    readonly payload = initialState;
}

export type All =
    | Push
    | Clear;
