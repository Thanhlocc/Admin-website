import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { UserService } from '../../services/user.service';
declare var bootstrap: any;
@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, FormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      // Nếu người dùng đã đăng nhập, chuyển hướng đến trang Dashboard
      this.router.navigate(['/Dashboard']);
    }
  }
  account_loginObj: any = {
    
    "username": "",
    "password": "",
    "rememberMe": false
  }
  forgotObj: any = {
    "email": "",
    
  }
  constructor(private authService: AuthService, private router: Router
    , private userService: UserService,
     private toast: NgToastService) { }
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }
  onSubmitLogin(form: NgForm) {
    
    if (form.valid) {
      this.authService.login(this.account_loginObj)
        .subscribe({
          next: (res: any) => {
            form.reset();
            this.authService.storeToken(res.token);
            const tokenPayload = this.authService.decodeToken();
            this.userService.setFullNameForStore(tokenPayload.unique_name);
            this.userService.setRoleForStore(tokenPayload.role);
            this.toast.success(res.message, "SUCCESS", 5000);

            this.router.navigate(['/Dashboard']);
          }

          ,
          error: (err: any) => {
            // Xử lý lỗi và hiển thị thông báo
            this.toast.danger("Login failed!", "ERROR", 5000);

          }
        });
    } 
  }
  openModalForgotPass() {
    const forgotModal = new bootstrap.Modal(document.getElementById('forgotModal')!, {
      backdrop: 'static',
      keyboard: false
    });
    forgotModal.show();
  }
  onSubmitForgot(forGotForm: NgForm) {
    if (this.checkValidEmail(this.forgotObj.email)) {
      console.log(this.forgotObj.email);
      //api call
      this.userService.senResetPasswordLink(this.forgotObj.email)
        .subscribe({
          next: (res) => {
            this.toast.success("Reset Success!", "SUCCESS", 5000);
            this.forgotObj.email = "";
            const buttonRef = document.getElementById("closeBtn");
            buttonRef?.click();
          },
          error: (err) => {
            this.toast.danger("Something went wrong!", "ERROR", 5000)
          }
        });

    }
  }
  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }
}
