import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-resetpw',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './resetpw.component.html',
  styleUrl: './resetpw.component.css'
})
export class ResetpwComponent implements OnInit {
  emailToReset!: string;
  emailToken!: string;
  passwordsDoNotMatch: boolean = false;
  password_ResetObj: any = {
    "email": "",
    "emailToken": "",
    "newPassword": "",
    "confirmPassword": "",
    

  }
  // Kiểm tra khớp mật khẩu khi người dùng nhập liệu
  checkPasswords() {
    this.passwordsDoNotMatch = this.password_ResetObj.newPassword !== this.password_ResetObj.confirmPassword;
  }
  constructor(private userService: UserService, private router: Router, private toast: NgToastService, private activatedRoute: ActivatedRoute) { }
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }
  onSubmitReset(resetPassWordForm: NgForm) {
    console.log('  email:', this.password_ResetObj.email);
    console.log('  emailToken:', this.password_ResetObj.emailToken);
    console.log('  newPassword:', this.password_ResetObj.newPassword);
    console.log('  confirmPassword:', this.password_ResetObj.confirmPassword);
    
    // Kiểm tra tính hợp lệ của đối tượng tài khoản
    if (resetPassWordForm.valid) {
      this.password_ResetObj.email = this.emailToReset;
      this.password_ResetObj.emailToken = this.emailToken;
      this.userService.resetPassword(this.password_ResetObj)
        .subscribe({
          next: (res: any) => {
            this.toast.success(res.message, "SUCCESS", 5000);
            resetPassWordForm.reset();
            this.router.navigate(['/Login']);
          }

          ,
          error: (err => {

            alert(err?.error.message)
          })
        })

    }
  }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(val => {
      this.emailToReset = val['email'];
      let uriToken = val['code']
      this.emailToken = uriToken.replace(/ /g,'+');
      console.log(this.emailToReset);
      console.log(this.emailToken);
    })
  }
}
