import {Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { UserService } from './services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  _currentUser: string;
  role: string;
  constructor(private router: Router, private userService: UserService) {
  }
  
  ngOnInit() {
    this.getCurrentUser();
  }

  logout(){
    localStorage.removeItem('currentUser');
    location.reload();
    this.router.navigate(['/login']);
  }

  getCurrentUser(){
    let id = JSON.parse(localStorage.getItem('currentUser'));

    if(id){
      id = id.user_id;
      this.userService.getById(id).pipe(first()).subscribe(
        result => {
              this._currentUser = result;
        },
        error => {
          console.log(error);
        });
      }
    }

}
