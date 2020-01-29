import * as auth from './auth/auth.reducers';
import { createFeatureSelector } from '@ngrx/store';
import * as cart from './shopcart/shopcart.reducer';


export interface AppState {
    auth: auth.State;
    shopcart: cart.State;
}

export const reducers = {
    auth: auth.reducer,
    shopcart: cart.shopcartReducer
};

export const selectAuthState = createFeatureSelector<AppState>('auth');
export const selectShopcartState = createFeatureSelector<AppState>('shopcart');