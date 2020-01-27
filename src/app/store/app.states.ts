import * as auth from './reducers/auth.reducers';
import { createFeatureSelector } from '@ngrx/store';
import * as cart from './reducers/shopcart.reducer';


export interface AppState {
    authState: auth.State;
    shopcart: cart.State;
}

export const reducers = {
    auth: auth.reducer,
    shopcart: cart.shopcartReducer
};

export const selectAuthState = createFeatureSelector<AppState>('auth');
export const selectShopcartState = createFeatureSelector<AppState>('shopcart');