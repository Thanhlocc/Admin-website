import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface Account_login {
  username: string;
  password: string;
  rememberMe: boolean;

}
export interface Account_register {
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  username: string;
  password: string;
  createdDate: string;

}
@Injectable({
  providedIn: 'root'
})
export class AuthService  {
  private userPayload: any;
  constructor(private http: HttpClient, private router: Router) {
    this.userPayload = this.decodeToken();
  }
  login(account: Account_login): Observable<Account_login> {
    return this.http.post<Account_login>(`https://localhost:7106/Account/login`, account);
    
  }
  signup(account: Account_register): Observable<Account_register> {
    return this.http.post<Account_register>(`https://localhost:7106/Account/register`, account);

  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/Login'])
  }
  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
  }
  getToken() {
    return localStorage.getItem('token')
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token')
  }
  decodeToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log(jwtHelper.decodeToken(token));
    return jwtHelper.decodeToken(token);
  }

  getfullNameFromToken() {
    if (this.userPayload) {
      return this.userPayload.unique_name;
    }
  }
  getRoleFromToken() {
    if (this.userPayload)
      return this.userPayload.role;
  }
}
