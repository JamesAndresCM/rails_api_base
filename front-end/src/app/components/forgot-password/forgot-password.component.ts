import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { PasswordService } from '../../services/password.service'
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  @ViewChild('reset') myNgForm;

  reset() {
    this.myNgForm.resetForm();
  }

  loading:boolean = false;
  submitted:boolean = false;
  returnUrl: string;
  forgotForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: MatSnackBar,
    private passwordService: PasswordService
  ) 
  { 
    this.forgotForm = this.formBuilder.group({
      email: ['',Validators.required]
    });
  }
  
  get f() { return this.forgotForm.controls; }

  onSubmit(){
    this.submitted = true;
    if (this.forgotForm.invalid){ return; }

    this.loading = true;
    let res = JSON.stringify(this.forgotForm.value)
  
    this.passwordService.sendPassword(res)
      .subscribe(
        data => {
            if (data.status == 404){
                this.alertService.open(data.msg, "Error");
                this.submitted = false;
                this.loading = false;
            }else{
                this.alertService.open(data.msg, "Success");
                this.loading = false;
                this.submitted = false;
                this.reset();
            }
        },
        error => {
          console.log(error);
        });
  }

}
