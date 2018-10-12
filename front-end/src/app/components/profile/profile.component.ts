import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material';
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { User } from '../../models/user';
import { MatDialog } from '@angular/material';
import { UserEditComponent } from '../user-edit/user-edit.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public user: any;
  isPopupOpened = true;

  constructor(
    private userService: UserService, 
    private alertService: MatSnackBar,
    private router: Router, 
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private location: Location
  ) { }

  ngOnInit() {
    this.getUser();
  }

  getUser(){
    this.route.params.subscribe(params => {
    let user_id = params['id'];

    this.userService.getById(user_id).subscribe(
      result => {
          if(result["status"] == 404){
            this.location.back();
          }else{
            this.user = result;
          }
      },
      error => {
            this.location.back();
        });
    });
  }

  editUser(id: number) {
      this.isPopupOpened = true;
      let user_res = this.userService.getById(id).subscribe(
        result => {
          let dialogRef;
            dialogRef = this.dialog.open(UserEditComponent, {
                data: result
            }),
            dialogRef.afterClosed().subscribe( response =>{
              this.isPopupOpened = false;
              })
          },
          error => {
          console.log(<any>error);
        });
    }

  delUser(id: number){
    if(window.confirm('Are sure you want to delete your account ?') == true){
      this.userService.deleteUser(id).subscribe(
        result => {
          if(result["status"] == 200){
            localStorage.removeItem('currentUser');
            this.router.navigate(['/login']);
            location.reload();
            /*
              fix this and reload
            this.alertService.error("Your Account has been deleted");
            */
          }else{
            console.log("error not del element...");
          }
        },
        error => {
          console.log(<any>error);
        });
    }
  }
}
