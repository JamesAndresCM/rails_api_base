import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GLOBAL } from './global';
import {Router} from "@angular/router";
import { first } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'observe': 'response'
  })
}

@Injectable()
export class AuthenticationService {
    public url:string;

    constructor(private http: HttpClient, private router: Router) { this.url = GLOBAL.url; }
 
    login(res: string) {
        return this.http.post<any>(this.url+'sign_in', res , httpOptions)
            .pipe(map(user => {
                //console.log(user.jwt);
                // login successful if there's a jwt token in the response
                if (user && user.jwt) {
                    location.reload();
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
 
                return user;
            }));
    }
 
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }

    isLoggedIn() {
    // get the auth user from localStorage
    let user = localStorage.getItem('currentUser');

    // check if currentUser is set, then...
    if (user) {
        //return true;
        this.router.navigate(['/home']);
    }

      return false;
    }

    getCurrentUserRole(){
      let user = JSON.parse(localStorage.getItem('currentUser'));
      return user.user.role;
    }

    getCurrentUserId(){
      let user = JSON.parse(localStorage.getItem('currentUser'));
      return user.user.id;
    }

}
