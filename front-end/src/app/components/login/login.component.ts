import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service'
import { MatSnackBar } from '@angular/material';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  res: string;
  loading = false;
  submitted = false;
  returnUrl: string;
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: MatSnackBar,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    //console.log(localStorage.currentUser);
    this.loginForm = this.formBuilder.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
    });

    // reset login status
    this.authenticationService.logout();
 
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }

  onSubmit(){
    this.submitted = true;
    if (this.loginForm.invalid){ return; }
   
    this.loading = true;
    this.res = '{"auth": '+JSON.stringify(this.loginForm.value)+'}' 
    this.authenticationService.login(this.res)
      .pipe(first())
      .subscribe(
        data => {
            if (data.status == 401){
                this.alertService.open(data.msg, "Error");
                this.loading = false;
            }else{
              this.router.navigate([this.returnUrl]);
            }
        });
  }
}
