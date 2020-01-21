import * as auth from './reducers/auth.reducers';
import { createFeatureSelector } from '@ngrx/store';
import {
    counterReducer,
    CounterState
} from './reducers/counter.reducer';

export interface AppState {
    authState: auth.State;
}



export interface StoreState {
    counter: CounterState;
}

export const reducers = {
    auth: auth.reducer,
    counter: counterReducer
};

export const selectAuthState = createFeatureSelector<AppState>('auth');