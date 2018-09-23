import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public currentUser: string;
  constructor(private userService: UserService) { 
  }

  ngOnInit() {
    this.getCurrentUser();
  }
  
  getCurrentUser(){
    let id = JSON.parse(localStorage.getItem('currentUser')).user_id;
    this.userService.getById(id).pipe(first()).subscribe(
      result => {
            this.currentUser = result;
      },
      error => {
        console.log(error);
      });
  }
}
