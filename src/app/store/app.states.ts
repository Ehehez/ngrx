import * as auth from './reducers/auth.reducers';
import { createFeatureSelector } from '@ngrx/store';
import * as counter from './reducers/counter.reducer';


export interface AppState {
    authState: auth.State;
}

export interface AppState2 {
    counter: counter.State;
}
export const reducers = {
    auth: auth.reducer,
    counter: counter.counterReducer
};

export const selectAuthState = createFeatureSelector<AppState>('auth');