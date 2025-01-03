import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth.serivce';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router) {}

  public async ngOnInit() {
    this.router.navigate(this.authService.loggedIn ? ['/profile'] : ['/login'])
      .then();
  }
}
