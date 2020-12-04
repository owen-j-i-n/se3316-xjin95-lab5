import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  validateForm!: FormGroup;
  username: string;
  password: string;
  email:String;
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.invalid)
      return;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    console.log(this.username, this.password);
    this.$http.post("http://127.0.0.1:3000/login", { email: this.email, password: this.password ,from:"web"}, httpOptions).subscribe(
      response => {
        console.log(response);
        //save token
        if(response["code"]=="1"){
          localStorage.setItem("token",response['token']);
          this.notification.create("success","Login Successfully!","Nice Action").onClose.subscribe(()=>{
            location.assign("/");
          });
        }
        else{
          this.notification.create("error","Error oocurs",response["message"]);
        }
        
      }
    );

  }
  loginByGithub() {
    this.$http.get("http://127.0.0.1:3000/loginByGithub").subscribe((res) => {
      window.open(res["path"],"_self");
      
      
    })
  }
