import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from '../auth.serivce';
import {Router} from '@angular/router';
import {getAuth, getRedirectResult} from '@angular/fire/auth';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router)  {}

  private readonly signInSuccessPath = ''

  protected loginError= false

  protected loading: boolean = true

  loginForm = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  })

  ngOnInit(): void {
    getRedirectResult(getAuth()).then(userCredential => {
        this.loading = false
        this.authService.handleSignInResult(userCredential)
          .then(signedIn => signedIn && this.router.navigate([this.signInSuccessPath]))
      }
    )

    this.loginForm.valueChanges.subscribe(() => {
      this.loginError = false
    })
  }

  async signIn() {
    const signedIn = await this.authService.signIn(this.username?.getRawValue(), this.password?.getRawValue())
    if (signedIn) {
      this.loginError = false
      return this.router.navigate([this.signInSuccessPath])
    } else {
      this.loginError = true
      return true
    }
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
}
