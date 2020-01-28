import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/Rx';
import { tap, map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import {
    AuthActionTypes,
    LogIn, LogInSuccess, LogInFailure,
    SignUp, SignUpSuccess, SignUpFailure,
    LogOut,
    GetStatus
} from '../actions/auth.actions';

@Injectable()
export class AuthEffects {

    constructor(
        private actions: Actions,
        private authService: AuthService,
        private router: Router,
    ) { }

    // effects go here
    @Effect()
    LogIn: Observable<any> = this.actions
        .ofType(AuthActionTypes.LOGIN)
        .map((action: LogIn) => action.payload)
        .switchMap(payload => {
            return this.authService.logIn(payload.identifier, payload.password)
                .pipe(map((user) => {

                    return new LogInSuccess({ token: user.jwt, email: user.user.email });
                }))
                .catch((error) => {
                    return Observable.of(new LogInFailure({ error: error }));
                });
        });

    @Effect({ dispatch: false })
    LogInSuccess: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.LOGIN_SUCCESS),
        tap((user) => {
            localStorage.setItem('token', user.payload.token);
            localStorage.setItem('user', user.payload.email);
            this.router.navigateByUrl('/');
        })
    );

    @Effect({ dispatch: false })
    LogInFailure: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.LOGIN_FAILURE)
    );

    @Effect()
    SignUp: Observable<any> = this.actions
        .ofType(AuthActionTypes.SIGNUP)
        .map((action: SignUp) => action.payload)
        .switchMap(payload => {
            return this.authService.signUp(payload.username, payload.email, payload.password)
                .map((user) => {
                    return new SignUpSuccess({ token: user.token, email: payload.email });
                })
                .catch((error) => {
                    return Observable.of(new SignUpFailure({ error: error }));
                });
        });

    @Effect({ dispatch: false })
    SignUpSuccess: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.SIGNUP_SUCCESS),
        tap((user) => {
            localStorage.setItem('token', user.payload.token);
            localStorage.setItem('user', user.payload.email);
            this.router.navigateByUrl('/');
        })
    );


    @Effect({ dispatch: false })
    SignUpFailure: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.SIGNUP_FAILURE)
    );

    @Effect({ dispatch: false })
    public LogOut: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.LOGOUT),
        tap((user) => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            location.reload();
        })
    );


}