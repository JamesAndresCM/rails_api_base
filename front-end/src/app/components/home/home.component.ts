import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentUser: any;
  constructor(private userService: UserService,private auth: AuthenticationService) { 
    let id = this.auth.getCurrentUserId();
    this.userService.getById(id).subscribe(
      result => {
            this.currentUser = result;
      },
      error => {
        console.log(error);
      });
  }
}
