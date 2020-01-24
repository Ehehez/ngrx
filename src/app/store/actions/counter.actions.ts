import { Action } from '@ngrx/store';


export interface CounterAction extends Action {
    payload?: number; // Optional
}

export class DoCounterUp implements CounterAction {
    readonly type: string = '[counter] up';
}

export class DoCounterDown implements CounterAction {
    readonly type: string = '[counter] down';
}

export class DoCounterReset implements CounterAction {
    readonly type: string = '[counter] reset';
}

export class DoCounterSet implements CounterAction {
    readonly type: string = '[counter] set';
    constructor(public payload: number) { }
}