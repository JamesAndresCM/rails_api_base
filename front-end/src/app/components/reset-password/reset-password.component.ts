import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service'
import { PasswordService } from '../../services/password.service'
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  @ViewChild('reset') myNgForm;

  reset() {
    this.myNgForm.resetForm();
  }

  res: any;
  loading = false;
  submitted = false;
  returnUrl: string;
  resetForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private passwordService: PasswordService
  ) { }

  ngOnInit() {
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
    this.res = {user: { token: token, password: this.f.password.value, password_confirmation: this.f.password_confirmation.value}}
    this.passwordService.resetPassword(this.res)
      .pipe(first())
      .subscribe(
        data => {
            if(data.status == 201){
              this.router.navigate(['/login']);
              this.alertService.success(data.msg);
            }else{
              this.alertService.error(data.msg);
              this.submitted = false;
              this.loading = false;
            }
        });
  }
}
