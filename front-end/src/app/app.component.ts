import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { MatSnackBar } from '@angular/material';
import { AuthenticationService } from './services/authentication.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  _currentUser: any;
  islogged: boolean;
  
  constructor(private router: Router, 
              private userService: UserService, 
              private auth: AuthenticationService,
              private alertService: MatSnackBar) 
  {
    this.getCurrentUser();
    this.islogged = this.auth.isLoggedIn();  
  }
  

  logout(){
    this.auth.logout();
    this.islogged = false;
    this.alertService.open("Logout Success", "Success");    
  }

  getCurrentUser(){
    let id = this.auth.getCurrentUserId();
    if(id){
      this.userService.getById(id).subscribe(
         result => {
            this._currentUser = result;
        },
        error => {
          console.log(error);
        });
      }
    }

}
