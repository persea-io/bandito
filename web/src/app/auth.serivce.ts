import {inject, Injectable} from '@angular/core'
import {
  Auth,
  authState,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithRedirect,
  User as FirebaseUser,
  UserCredential
} from '@angular/fire/auth';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router'
import {jwtDecode} from "jwt-decode"
import {BehaviorSubject, Observable} from 'rxjs'

export interface UserDetails {
  id: string,
  username: string,
  idToken: string
}

export const authGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(AuthService).canActivate()
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  private user: UserDetails | null = null
  private firebaseUser: FirebaseUser | null = null

  constructor(
    private readonly firebaseAuth: Auth,
    private readonly router: Router
  ) {
    authState(firebaseAuth).subscribe(firebaseUser => {
      if (firebaseUser) {
        this.firebaseUser = firebaseUser as FirebaseUser
        firebaseUser.getIdToken().then(token => {
          if (token) {
            this.user = this.userDetailsFromIdToken(token)
            this.loading.next(false)
          }
        })
      } else {
        this.firebaseUser = null
        this.user = null
        this.loading.next(false)
      }
    })
  }

  async signIn(email: string, password: string) {
    this.user = null
    try {
      return this.handleSignInResult(
        await signInWithEmailAndPassword(this.firebaseAuth, email, password))
    } catch (error) {
      return false
    }
  }

  signInWithGoogle() {
    this.user = null
    const provider = new GoogleAuthProvider()

    signInWithRedirect(this.firebaseAuth, provider)
      .catch(e => console.error(JSON.stringify(e)))
  }

  public async handleSignInResult(userCredential :UserCredential | null) {
    return (userCredential?.user) ?
      this.completeSignIn(userCredential.user) :
      false
  }

  private async completeSignIn(firebaseUser: FirebaseUser | null) {
    try {
      if (firebaseUser) {
        this.firebaseUser = firebaseUser
        const token = await this.firebaseUser.getIdToken()
        this.user = this.userDetailsFromIdToken(token)
        return true
      }
    } catch (e) {
      console.error(`Error getting token for user ${firebaseUser?.uid}: ${e}`)
    }
    return false
  }

  async signOut() {
    this.firebaseUser = null
    this.user = null
    try {
      await this.firebaseAuth.signOut()
      return true
    } catch (e) {
      console.error(`Error signing out user: ${e}`)
      return false
    }
  }

  canActivate() {
    if (!this.loggedIn) {
      this.router.navigate(['']).then()
      return false
    }
    return true
  }

  get userId(): string {
    return this.user?.id ?? ''
  }

  get loggedIn(): boolean {
    return !!this.user
  }

  get isLoading(): Observable<boolean> {
    return this.loading
  }

  get token(): Promise<string | null> {
    return (this.firebaseUser) ? this.firebaseUser.getIdToken() : Promise.resolve(null)
  }

  private userDetailsFromIdToken(idToken: string) {
    const decodedToken: any = jwtDecode(idToken)
    return {
      idToken: idToken,
      id: decodedToken['sub'],
      username: decodedToken['email'],
    }
  }
}
