import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../models/user';


@Injectable()
export class AuthService {
  private BASE_URL = 'http://localhost:1337';

  private headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

  constructor(private http: HttpClient) { }

  getToken(): string {
    return localStorage.getItem('token');
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