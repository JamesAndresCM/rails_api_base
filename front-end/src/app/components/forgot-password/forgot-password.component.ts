import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service'
import { PasswordService } from '../../services/password.service'
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  @ViewChild('reset') myNgForm;

  reset() {
    this.myNgForm.resetForm();
  }

  res: string;
  loading = false;
  submitted = false;
  returnUrl: string;
  forgotForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private passwordService: PasswordService
  ) { }

  ngOnInit() {
    this.forgotForm = this.formBuilder.group({
      email: ['',Validators.required]
    });
  }
  
  get f() { return this.forgotForm.controls; }

  onSubmit(){
    this.submitted = true;
    if (this.forgotForm.invalid){ return; }

    this.loading = true;
    this.res = JSON.stringify(this.forgotForm.value)
  
    this.passwordService.sendPassword(this.res)
      .pipe(first())
      .subscribe(
        data => {
            if (data.status == 404){
                this.alertService.error(data.msg);
                this.submitted = false;
                this.loading = false;
            }else{
                this.alertService.success(data.msg);
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
