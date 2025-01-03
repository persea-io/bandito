import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {AuthService} from '../app/auth.serivce';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private titleService: Title)  {}

  loginError: string | undefined

  loginForm = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  })

  ngOnInit(): void {
    this.titleService.setTitle("Login")
  }

  login() {
    this.authService.authenticate(this.username?.getRawValue(), this.password?.getRawValue())
      .catch((error) => {
        this.loginError = 'Invalid Credentials. Please check your username and password.'
      });
  }

  get username() { return this.loginForm.get('username'); }

  get password() { return this.loginForm.get('password'); }

}
