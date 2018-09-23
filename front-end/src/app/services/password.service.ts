import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global'; 
import { Observable } from 'rxjs';
 

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'observe': 'response'
  })
}

@Injectable()
export class PasswordService {
    public url:string;
    constructor(private http: HttpClient) {
      this.url = GLOBAL.url;
     }
 
    sendPassword(email: string): Observable<any>{
      return this.http.post(this.url+'forgot_password', email, httpOptions);
    }
    
    resetPassword(user: string): Observable<any>{
      return this.http.post(this.url+'password_reset', user, httpOptions);
    }

}
