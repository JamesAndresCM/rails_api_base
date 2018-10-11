import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public submitted = false;
  public loading = false;
  public data;
  public registerForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _registerService: RegisterService,
    private alertService: MatSnackBar
  ) { }

  ngOnInit() {
      this.registerForm = this.formBuilder.group({
        username: ['',Validators.required],
        email: ['',Validators.required],
        password: ['',[Validators.required, Validators.minLength(8)]],
        password_confirmation: ['',[Validators.required, Validators.minLength(8)]]
      });
  }
  
  get f() { return this.registerForm.controls; }

  onSubmit(){
    this.submitted = true;
    if(this.registerForm.invalid){ return; }
    
    this.loading = true;
    this.data = '{"user": '+JSON.stringify(this.registerForm.value)+'}'
    this._registerService.registerUser(this.data)
      .pipe(first())
      .subscribe(
			response => {
          if (response.status == 422){
            for (var key in response.msg){
                let error_msg = key.charAt(0).toUpperCase() + key.slice(1)+": "+response.msg[key];
                this.alertService.open(error_msg, "Error");
                this.loading = false;    
            } 
          }else{
            //console.log(response);
            localStorage.setItem('currentUser', JSON.stringify(response));
            this.router.navigate(['/home']);
            location.reload();
            this.alertService.open("Wellcome","Success");
          }
					//console.log(response);
				});
			}

}
