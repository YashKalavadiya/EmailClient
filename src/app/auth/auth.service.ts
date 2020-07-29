import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';


interface UsernameAvailableResponse{
  available: boolean;
}

interface SignedinResponse {
  username: string;
  authenticated: boolean;
}

interface SigninResponse {
  username: string;
}

interface SignupCredentials {
  userName: string;
  password: string;
  passwordConfirmation: string;
}

interface SignInCredentials {
  username: string;
  password: string;
}

interface SignupResponse {
  username: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  rootUrl = 'https://api.angular-email.com';
  signedin$ = new BehaviorSubject(null);
  username = '';

  constructor(private http: HttpClient) { }

  usernameAvailable(username: string){
    return this.http.post<UsernameAvailableResponse>(
      `${this.rootUrl}/auth/username`, {
            username
        });
  }

  signUp(credentials: SignupCredentials) {
    return this.http.post<SignupResponse>(
      `${this.rootUrl}/auth/signup`,
      {
        username: credentials.userName,
        password: credentials.password,
        passwordConfirmation: credentials.passwordConfirmation
      }
    ).pipe(
      tap(({username}) => {
        this.signedin$.next(true);
        this.username = username;
      })
    );
  }

  checkAuth() {
    return this.http.get<SignedinResponse>(`${this.rootUrl}/auth/signedin`)
    .pipe(
      tap(({ authenticated, username }) => {
        this.signedin$.next(authenticated);
        this.username = username;
      })
    );
  }

  signout() {
    return this.http.post(`${this.rootUrl}/auth/signout`, {})
    .pipe(
      tap(() => {
        this.signedin$.next(false);
      })
    );
  }

  signin(credentials: SignInCredentials) {
    return this.http.post<SigninResponse>(`${this.rootUrl}/auth/signin`, credentials)
    .pipe(
      tap(({username}) => {
        this.signedin$.next(true);
        this.username = username;
      })
    );
  }
}
