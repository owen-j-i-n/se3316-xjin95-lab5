import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpClient, HttpHeaders } from '@angular/common/http'
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userInfo={
    username:"",
    _id:""
  }
  user_list = [];
  user_list_loaded =false;
  constructor(private $http:HttpClient,private notification:NzNotificationService){}


  ngOnInit(): void {
    this.$http.get(`http://127.0.0.1:3000/get_users?token=${localStorage.getItem("token")}`).subscribe((resp)=>{
      if(resp["code"]=="0"){
        this.user_list = resp["user_list"];
        this.user_list_loaded = true;
      }
    })

    //获取userInfo
    var token = localStorage.getItem("token");
    this.$http.get(`http://127.0.0.1:3000/validateToken?token=${token}`).subscribe((resp)=>{
      if(resp["code"]=="1"){
        this.userInfo = resp["user"];
        
      }
      else{
        localStorage.removeItem("token");
      }
    })
  }
  change_user(user,state,role){
    this.$http.get(`http://127.0.0.1:3000/change_user?user_id=${user._id}&state=${state}&role=${role}`).subscribe((resp)=>{
      if(resp["code"]=="0"){
        this.notification.create("success","Change User State Successfully","good！");
        user.state = state;
        user.role = role;
      }
      else{
        this.notification.create("error","Error",resp["message"]);

      }
    })
  }

}
