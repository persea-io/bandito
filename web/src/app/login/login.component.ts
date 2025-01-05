import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from '../auth.serivce';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private readonly authService: AuthService)  {}

  loginError= false

  loginForm = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  })

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(change => {
      this.loginError = false
    })
  }

  login() {
    this.authService.authenticate(this.username?.getRawValue(), this.password?.getRawValue())
      .then(() => {
        this.loginError = false
    }).catch((error) => {
        this.loginError = true
      });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
}
