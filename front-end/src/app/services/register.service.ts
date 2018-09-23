import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { GLOBAL } from './global';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'observe': 'response'
  })
}

@Injectable()
export class RegisterService{

  public url:string;

  constructor(public _http: HttpClient){
		this.url = GLOBAL.url;
	}

  registerUser(user: User): Observable<any>{
		return this._http.post(this.url+'sign_up', user, httpOptions );
	}
}
