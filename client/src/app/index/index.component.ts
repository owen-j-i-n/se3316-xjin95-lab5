import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment';
const { apiUrl } = environment;


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  
  course_list_original = [];
  course_list_loaded = false;

  courseLists = [];
  courseLists_load = false;

  user={
    username:"",
    _id:""
  }
  constructor(private $http:HttpClient) { }

  ngOnInit(): void {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    
    var token = "";
    if(location.search!="" && location.search.includes("token")){
      token = location.search.split("=")[1];
      localStorage.setItem("token",token);
      setTimeout(() => {
        location.assign("/")
      }, 1000);
    }
    else{
      token = localStorage.getItem("token");
      this.$http.get(`${apiUrl}/validateToken?token=${token}`).subscribe((resp)=>{
        if(resp["code"]=="1"){
          this.user = resp["user"];
          
        }
        else{
          localStorage.removeItem("token");
        }
      })
    }
    this.$http.get(`${apiUrl}/get_courses`).subscribe((resp)=>{
            this.course_list_original = resp["course_list"];
            this.course_list_loaded = true;
      });
  }
 

}
