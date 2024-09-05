import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './components/product/product.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomerComponent } from './components/customer/customer.component';
import { OrderComponent } from './components/order/order.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

import { authGuard } from './guards/auth.guard';
import { ResetpwComponent } from './components/resetpw/resetpw.component';

const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch:'full' },
  { path: 'Dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'Customer', component: CustomerComponent, canActivate: [authGuard] },
  { path: 'Order', component: OrderComponent, canActivate: [authGuard] },
  { path: 'Login', component: LoginComponent },
  { path: 'Signup', component: SignupComponent },
  { path: 'reset', component: ResetpwComponent },
  { path: 'Product', component: ProductComponent, canActivate: [authGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
