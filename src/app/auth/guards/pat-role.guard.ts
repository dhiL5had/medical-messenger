import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

import { AuthService } from "../auth.service";

@Injectable()
export class PatAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private location: Location) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isDoctor = this.authService.getIsDoctor();
    if (isDoctor) {
      this.location.back();
    } 
    return !isDoctor;
  }

}