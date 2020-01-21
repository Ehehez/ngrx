import { Action } from '@ngrx/store';

/**
 * Action base type for Counter.
 * @property type       Action type.
 * @property payload    Option data used to update state.
 */
export interface CounterAction extends Action {
    payload?: number; // Optional
}

/**
 * Actions: Naming convention Do<Reducer><Action>
 * 1. Prefix with 'Do'
 * 2. Follow by name of Reducer updating the State.
 * 3. Action name.
*/
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