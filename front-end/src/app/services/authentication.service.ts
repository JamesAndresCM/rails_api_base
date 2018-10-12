import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GLOBAL } from './global';
import { Router } from "@angular/router";


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
        return this.http.post<any>(`${this.url}sign_in`, res , httpOptions)
            .pipe(map(user => {
                if (user && user.jwt) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            }));
    }
 
    logout() {
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }

    isLoggedIn() {
      let user = localStorage.getItem('currentUser');
      if (user) {
        this.router.navigate(['/home']);
        return true;
      }
      return false;
    }

    getCurrentUserRole(){
      let user = JSON.parse(localStorage.getItem('currentUser'));
      return user.user.role;
    }

    getCurrentUserId(){
      if(this.isLoggedIn()){
        let user = JSON.parse(localStorage.getItem('currentUser'));
        return user.user_id;
      }
    }

}
