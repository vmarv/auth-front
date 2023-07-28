import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  sign(payLoad: {email: string, password: string}): Observable<any> {
    return this.http.post<{token: string}>(`${this.url}/sign`, payLoad).pipe(
      map((res) => {
        localStorage.removeItem('access_token');
        localStorage.setItem('access_token', res.token);
        return this.router.navigate(['admin']);
      }),
      catchError((error) => {
        if (error.error.message) return throwError(() => error.error.message);

        return throwError(() => error.error.message)
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    return this.router.navigate(['']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');

    if (!token) return false;

    const jwtHelper = new JwtHelperService();
    return !jwtHelper.isTokenExpired(token);
  }

}
