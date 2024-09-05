import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
})
export class NavbarComponent implements OnInit {
  public fullName: string = "";
  public role!: string;
  constructor(private auth: AuthService, private router: Router, private userService: UserService) { }
  ngOnInit() {
    this.userService.getFullNameFromStore()
      .subscribe(val => {
        const fullNameFromToken = this.auth.getfullNameFromToken();
        this.fullName = val || fullNameFromToken
      });
    this.userService.getRoleFromStore()
      .subscribe(val => {
        const roleFromToken = this.auth.getRoleFromToken();
        this.role = val || roleFromToken;
      })
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/Login']);
  }
}
