import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { Validators } from '@angular/forms';
import { User } from '../../models/user';
import { Router } from '@angular/router';

export interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  roles: Role[] = [
    {value: "user", viewValue: 'User'},
    {value: "admin", viewValue: 'Admin'}
  ];  

  public submitted = false;
  public role: string;
  public _user_id: number;
  public userForm: FormGroup;
  public user: any;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UserEditComponent>,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
            this.user = new User(0,'','','','','','');
    }

  onNoClick(): void {
        this.dialogRef.close();
  }

  ngOnInit() {
      this.userForm = this.formBuilder.group({
            id: [this.data.id],
            username: [this.data.username, [Validators.required]],
            email: [ this.data.email, [Validators.required]],
            avatar: null,
            role: [this.data.role],
            current_password: [this.data.current_password],
            password: [ this.data.password],
            password_confirmation: [ this.data.password_confirmation]
            });
      this.getRole();
      this.getUserId();
      this.data.id;
      this.data.avatar;
    }

    getRole(){
         let id = JSON.parse(localStorage.getItem('currentUser')).user_id;
         this.userService.getById(id).subscribe(result => {this.role = result.role;});
         return this.role;
    }
  
    get f() { return this.userForm.controls; }

    onSubmit(){
        this.submitted = true;
        if(this.userForm.invalid){ return; }

        let u_role = this.getRole();
        var avatar = (this.f.avatar.value == null) ? this.data.avatar : "data:image/png;base64,"+ this.f.avatar.value.value;

        if(this.f.password.value == null && this.f.password_confirmation.value == null){
          this.user = {user: {username: this.f.username.value, email: this.f.email.value, avatar: avatar, current_password: this.f.current_password.value}}   
        }else{
          this.user = {user: {username: this.f.username.value, email: this.f.email.value, avatar: avatar, password: this.f.password.value, current_password: this.f.current_password.value, password_confirmation: this.f.password_confirmation.value}}
        }     

 
        if(u_role == "admin"){ 
          this.user["user"]["role"] = this.f.role.value;
        }
        
        this.user = JSON.stringify(this.user);
        //console.log(this.user);
              
        this.userService.editUser(this.data.id,this.user).subscribe(
          response => {
            if(response.status == 422){
               for (var key in response.msg){
                let error_msg = key.charAt(0).toUpperCase() + key.slice(1)+": "+response.msg[key];
                this.alertService.error(error_msg);
                this.dialogRef.close();
            }
              //this.router.navigate(['/']);
            }else{
              if(this.getRole() != "admin"){
                this.dialogRef.close();
                this.router.navigate(['/home']);
                this.alertService.success("User has been updated", true);
                console.log(response);
              }else if (this.getRole() == "admin" && this.router.url.split("/")[1] == "profile"){
                  this.dialogRef.close();
                  this.router.navigate(['/home']);
                  this.alertService.success("User has been updated", true);
              }else{
                  this.dialogRef.close();
                  this.alertService.success("User has been updated", true);
              }
              }
            },
            error => {
              console.log(<any>error);
        });
        
    }

     getUserId(){
        this._user_id = JSON.parse(localStorage.getItem('currentUser')).user_id;
        return this._user_id;
    }


    onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.userForm.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        })
      };
    }
  }

  /*
  getUser(id: number){

    this.userService.getById(id).subscribe(
      result => {
            console.log(result);
            //this.user = result;
      },
      error => {
            //this.router.navigate(['/profile',c_user.user_id ]);
            console.log(error);
        });
  }*/


}
