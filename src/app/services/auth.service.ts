import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { User } from '../models/user';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.states';


@Injectable()
export class AuthService {
  private BASE_URL = 'http://localhost:1337';
  private state;
  private subs = new Subscription();
  private headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });


  constructor(private http: HttpClient,
    store: Store<AppState>) {
    this.subs.add(store.subscribe(o => this.state = o.auth));

  }

  getToken(): string {
    if (this.state.user != null) {
      return this.state.user.token;
    }
    if (localStorage.getItem('token')) {

      return localStorage.getItem('token');
    }

    return null;
  }

  logIn(email: string, password: string): Observable<any> {
    const body = new HttpParams()
      .set("identifier", email)
      .set("password", password);

    const url = `http://localhost:1337/auth/local`;

    return this.http.post<User>(url, { 'identifier': email, 'password': password });
  }

  signUp(username: string, email: string, password: string): Observable<User> {
    const body = new HttpParams()
      .set("username", username)
      .set("email", email)
      .set("password", password);
    const url = `${this.BASE_URL}/auth/local/register`;
    return this.http.post<User>(url, body);
  }

}