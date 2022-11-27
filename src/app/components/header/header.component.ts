import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  isDoctor!: boolean;
  private authListenerSubs!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.isDoctor = this.authService.getIsDoctor();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((isAuthenticated: any) => {
      this.userIsAuthenticated = isAuthenticated;
      this.isDoctor = this.authService.getIsDoctor();
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

}