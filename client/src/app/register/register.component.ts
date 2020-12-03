import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { NzNotificationService } from 'ng-zorro-antd/notification';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder,public $http: HttpClient,private notification:NzNotificationService) { }
  validateForm!: FormGroup;
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };

  new_user={
    username:"",
    password:"",
    email:"",
    check_password:"",
    role:"user",
    from:"web"
  }
  
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    console.log(this.validateForm.invalid);
    if(this.validateForm.invalid){
      return;
    }
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    this.$http.post("http://127.0.0.1:3000/register",this.new_user,httpOptions).subscribe((resp)=>{
      if(resp["code"]=="1"){
        this.notification.create("success","Register Successfully","Please Check you email to Activate your account and Sign in!!!",{nzDuration:0}).onClose.subscribe(()=>{
          window.location.assign("/login");
        });
      }
      else{
        this.notification.create("error","Error occurs",resp["message"]);
      }
    })

  }
  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  ngOnInit(): void {
    
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      nickname: [null, [Validators.required]],
      
    });
  }

}
