import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global'; 
import { User } from '../models/user';
import { Observable } from 'rxjs';
 

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'observe': 'response'
  })
}

@Injectable()
export class UserService {
    public url:string;
    constructor(private http: HttpClient) {
      this.url = GLOBAL.url;
     }
 
    getAll(): Observable<any>{
        return this.http.get<User[]>(this.url+'admin/users', httpOptions);
    }
 
    getById(id: number): Observable<any>{
        return this.http.get(this.url+'users/' + id, httpOptions);
    }
 
    editUser(username, user: User): Observable<any> {
        return this.http.patch(this.url+'users/' + username, user, httpOptions);
    }

    deleteUser(id: number): Observable<any>{
        return this.http.delete(this.url+'users/' + id, httpOptions);
    }

    sendPassword(email: string): Observable<any>{
      return this.http.post(this.url+'forgot_password', email, httpOptions);
    }
}
