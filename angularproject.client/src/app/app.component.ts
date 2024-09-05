import { Component, ApplicationRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ProductComponent } from './components/product/product.component';
import { OrderComponent } from './components/order/order.component';
import { CustomerComponent } from './components/customer/customer.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

import { NgToastModule, NgToastService, ToasterPosition } from 'ng-angular-popup';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ResetpwComponent } from './components/resetpw/resetpw.component';


// Ensure Bootstrap JS is properly imported
declare var bootstrap: any;

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, RouterOutlet, RouterLink,
    NavbarComponent, SidebarComponent, DashboardComponent,
    ProductComponent, CustomerComponent, OrderComponent,
    LoginComponent, SignupComponent,
    NgToastModule, ResetpwComponent],

})
export class AppComponent implements OnInit {
  title = 'admin-dashboard';
  isSidebarClosed = false;
  ToasterPosition = ToasterPosition;
  public fullName: string = "";
  public role!: string;
  constructor(private toast: NgToastService, public auth: AuthService, private router: Router, private userService: UserService) { }
  handleSidebarToggle(isClosed: boolean) {
    this.isSidebarClosed = isClosed;
  }
  ngOnInit() {
    this.userService.getFullNameFromStore()
      .subscribe(val => {
        const fullNameFromToken = this.auth.getfullNameFromToken();
        this.fullName = val || fullNameFromToken;
        console.log('Full Name:', this.fullName);
      });
    this.userService.getRoleFromStore()
      .subscribe(val => {
        const roleFromToken = this.auth.getRoleFromToken();
        this.role = val || roleFromToken;
      })
   
    
  }
  
  
}
