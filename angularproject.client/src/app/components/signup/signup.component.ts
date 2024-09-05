import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, RouterModule, FormsModule],
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  account_signUpObj: any = {
    "firstName": "",
    "lastName": "",
    "email": "",
    "address": "",
    "username": "",
    "password": "",
    "createdDate": "",
    
  }
  constructor(private authService: AuthService, private router: Router, private toast: NgToastService) { }
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash"
  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }
  onSubmitSignUp(signUpForm: NgForm) {
    console.log('  Firstname:', this.account_signUpObj.firstName);
    console.log('  Lastname:', this.account_signUpObj.lastName);
    console.log('  Email:', this.account_signUpObj.email);
    console.log('  Address:', this.account_signUpObj.address);
    console.log('  Username:', this.account_signUpObj.username);
    console.log('  Password:', this.account_signUpObj.password);
    this.account_signUpObj.createdDate = new Date().toISOString();
    // Kiểm tra tính hợp lệ của đối tượng tài khoản
    if (signUpForm.valid) {
      this.authService.signup(this.account_signUpObj)
        .subscribe({
          next: (res: any) => {
            this.toast.success(res.message, "SUCCESS", 5000);
            signUpForm.reset();
            this.router.navigate(['/Login']);
          }

          ,
          error: (err => {

            alert(err?.error.message)
          })
        })
  
    }
  }
  
}
