import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { GLOBAL } from './global';
import { Router } from "@angular/router";


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'observe': 'response'
  })
}

@Injectable()
export class RegisterService{

  public url:string;

  constructor(public _http: HttpClient,private router: Router){
		this.url = GLOBAL.url;
	}

  registerUser(user: User): Observable<any>{
		return this._http.post(`${this.url}sign_up`, user, httpOptions )
                .pipe(map(data => {
                    localStorage.setItem('currentUser', JSON.stringify(data));
                    this.router.navigate(['/home']);
                    return data;
                }));
	}
}
