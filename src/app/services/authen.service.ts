import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User, Authen } from '../domain';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthenService {
  private readonly domain = 'users';
  private headers = new HttpHeaders({
      'Content-Type': 'application/json'
  });
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOi8vdG9wdGFsLmNvbS' +
  '.yRQYnWzskCZUxPwaQupWkiUzKELZ49eM7oWxAQK_ZXw';

  constructor (private http: HttpClient) {}

  register(user: User): Observable<Authen> {
    const uri = `${environment.apiUrl}/${this.domain}`;
    return this.http
      .get(uri, {params: {email: user.email}})
      .switchMap(res => {
        if (res[0]) {
          throw new Error('user existed');
        } else {
          return this.http
              .post(uri, JSON.stringify(user), {headers: this.headers})
              .map(ures => ({token: this.token, user: ures}) as Authen);
        }
      });

    }

    login(username: string, password: string): Observable<Authen> {
      const uri = `${environment.apiUrl}/${this.domain}`;
      return this.http
        .get(uri, {params: {email: username, password: password}})
        .map( res => {
          if (!res[0]) {
            throw new Error('username or password not match');
          } else {
            return {
              token: this.token,
              user: res[0] as User
            };
          }
        });
    }


}
