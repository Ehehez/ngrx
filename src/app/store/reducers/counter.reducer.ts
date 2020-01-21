/*import { Action, ActionReducer } from '@ngrx/store';
import { Observable } from 'rxjs';

export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';


export interface State {
    counter: Observable<number>;
}



export class CounterState {
    constructor(public counter: number = 0) { }
}

export const initialState = new CounterState(12);

export function counterReducer(state: number = 0, action: Action) {
    switch (action.type) {
        case INCREMENT:
            return state + 1;

        case DECREMENT:
            return state - 1;

        case RESET:
            return 0;

        default:
            return state;
    }
}*/

// Counter Actions
import {
    DoCounterDown,
    DoCounterUp,
    DoCounterReset,
    DoCounterSet,
    CounterAction
} from './../actions/counter.actions';

/**
 * Store state for Counter
 * @property count    Counter current value.
*/
export class CounterState {
    constructor(public count: number = 0) { }
}

// Initial Store value for Counter.
const initialState = new CounterState(0);

/**
 * Reducer maintains state for Counter, filters all Action sent from Store.
 * @param state   Counter state from Store.
 * @param action  Dispacted Action with optional payload.
 */
export function counterReducer(state: CounterState = initialState,
    action: CounterAction): CounterState {
    // Switch on Class instance to determine action type.
    switch (action.constructor) {
        case DoCounterUp: {
            return new CounterState(state.count + 1);
        }

        case DoCounterDown: {
            return new CounterState(state.count - 1);
        }

        case DoCounterReset: {
            return new CounterState(0);
        }

        case DoCounterSet: {
            return new CounterState(action.payload);
        }

        default: {
            return state;
        }
    }
}