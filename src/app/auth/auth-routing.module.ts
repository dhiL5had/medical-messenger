import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoggedInAuthGuard } from "./guards/loggedIn-auth.guard";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

const routes: Routes = [
  { path: 'signup', component: SignupComponent, canActivate: [LoggedInAuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoggedInAuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [LoggedInAuthGuard]
})
export class AuthRoutingModule {}