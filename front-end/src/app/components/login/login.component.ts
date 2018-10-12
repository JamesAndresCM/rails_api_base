import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service'
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loading:boolean = false;
  submitted:boolean = false;
  returnUrl:string;
  loginForm:FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: MatSnackBar,
    private authenticationService: AuthenticationService
  ) 
  { 
    this.loginForm = this.formBuilder.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }


  onSubmit(){
    this.submitted = true;
    if (this.loginForm.invalid){ return; }
    this.loading = true;
    let res:any = {auth: this.loginForm.value}
    this.authenticationService.login(res)
        .subscribe(
          data => {
              if(data.status == 401){
                  this.alertService.open(data.msg, "Error");
                  this.loading = false;
              }else{
                    location.reload();
              }
          },
          error => {
            console.log(error);
          });
  }
}
