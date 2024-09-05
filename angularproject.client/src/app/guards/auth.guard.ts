import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(NgToastService);

  const isLoggedIn = authService.isLoggedIn();
  console.log('Is Logged In:', isLoggedIn);
  if (isLoggedIn) {
    
    return true; // Nếu người dùng đã đăng nhập, cho phép truy cập
  } else {
    // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
    toast.danger("Bạn cần đăng nhập trước!", "ERROR", 5000);
    router.navigate(['/Login']);
    return false; // Chặn truy cập vào route
  }
};
