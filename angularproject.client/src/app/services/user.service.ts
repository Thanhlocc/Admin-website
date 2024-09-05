import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ResetPassword } from '../models/reset-password.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private fullName$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  constructor(private http: HttpClient) { }
  public getRoleFromStore() {
    return this.role$.asObservable();
  }

  public setRoleForStore(role: string) {
    this.role$.next(role);
  }
  public getFullNameFromStore() {
    return this.fullName$.asObservable();
  }
  public setFullNameForStore(fullname: string) {
    this.fullName$.next(fullname);
  }
  //Reset password
  private baseUrl: string = "https://localhost:7106/Account";
  senResetPasswordLink(email: string) {
    return this.http.post<any>(`${this.baseUrl}/send-reset-email/${email}`, {})
  }
  resetPassword(resetPasswordObj: ResetPassword) {
    return this.http.post<any>(`${this.baseUrl}/reset-password`, resetPasswordObj);
  }
}
