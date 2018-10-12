import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { PasswordService } from '../../services/password.service'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  @ViewChild('reset') myNgForm;

  reset() {
    this.myNgForm.resetForm();
  }

  private loading:boolean = false;
  private submitted:boolean = false;
  private returnUrl: string;
  private resetForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: MatSnackBar,
    private passwordService: PasswordService
  ) 
  { 
    this.resetForm = this.formBuilder.group({
      password: ['',[Validators.required, Validators.minLength(8)]],
      password_confirmation: ['',[Validators.required, Validators.minLength(8)]]
    });
  }

  get f() { return this.resetForm.controls; }

  onSubmit(){
    this.submitted = true;
    if (this.resetForm.invalid){ return; }
    this.loading = true;

    let token = this.route.snapshot.queryParams["token"];
    let res:any = {user: { token: token, password: this.f.password.value, password_confirmation: this.f.password_confirmation.value}}
    this.passwordService.resetPassword(res)
      .subscribe(
        data => {
            if(data.status == 201){
              this.router.navigate(['/login']);
              this.alertService.open(data.msg, "Success");
            }else{
              this.alertService.open(data.msg, "Error");
              this.submitted = false;
              this.loading = false;
            }
        });
  }
}
