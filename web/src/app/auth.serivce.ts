import {inject, Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {jwtDecode} from "jwt-decode";

export interface UserDetails {
  id: string,
  username: string,
  role: string,
  tenant?: string,
  firstName?: string,
  lastName: string,
  fullName: string,
  token: string
}

export const authGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(AuthService).canActivate(next, state);
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  readonly userKey = 'bandito-user';

  constructor(
    private readonly firebaseAuth: AngularFireAuth,
    private readonly router: Router
  ) {
    this.firebaseAuth.authState.subscribe((user) => {
      if (!user) {
        sessionStorage.removeItem(this.userKey)
      }
    })
  }

  login(redirectUri: string) {
    this.clearState();
    this.router.navigate(['/login']).then();
  }

  authenticate(email: string, password: string) {
    return this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        if (userCredential?.user) {
          userCredential.user.getIdToken(false)
            .then(rawToken => {
              if (!rawToken) {
                // Logged out
                this.clearState();
                return;
              }
              this.assignUserFromToken(rawToken);
              this.router.navigate(['/profile'], {replaceUrl: true}).then();
            })
            .catch(() => {
              // Error retrieving token, should not happen
              this.clearState();
            })
        }
      })
  }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    if (!this.loggedIn) {
      this.login(state.url);
      return false;
    }
    return true
  }

  get user(): UserDetails | undefined {
    const user = sessionStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : undefined;
  }

  get token(): string | undefined {
    return this.user?.token;
  }

  get loggedIn(): boolean {
    return !!this.user;
  }

  private clearState() {
    sessionStorage.removeItem(this.userKey);
  }

  private assignUserFromToken(rawToken: string) {
      const decodedToken: any = jwtDecode(rawToken)
      const user = {
        token: rawToken,
        id: decodedToken['sub'],
        username: decodedToken['email'],
      }
      sessionStorage.setItem(this.userKey, JSON.stringify(user));
    }
}
