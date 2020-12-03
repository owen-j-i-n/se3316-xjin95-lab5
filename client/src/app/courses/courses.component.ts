import { Component, Input, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpClient, HttpHeaders } from '@angular/common/http'




@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  
  course_list_show=[];
  
  @Input()
  userInfo;

  @Input()
  course_list_original;

  @Input()
  course_list_loaded;

  search_keywords="";


  

  constructor(private notification:NzNotificationService,private $http:HttpClient,) { }

  ngOnInit(): void {
    var temp_interval = setInterval(()=>{
      
      if(this.course_list_loaded){
        clearInterval(temp_interval);
        for(var course of this.course_list_original){
          course["expand"]=false;
        }
        this.course_list_show = this.course_list_original;
        
      }
    },500);
    
  }
  search_courses(){
    var keyword_list = this.search_keywords.trim().split(' ');
    if(this.search_keywords.trim().length<4){
      this.notification.create("warning","At least 4 characters","please input keywords again");
      return;
    }
    this.course_list_show = this.course_list_original.filter(course=>{
      for(let keyword of keyword_list){
        if(course.catalog_nbr.toLowerCase().includes(keyword.toLowerCase()) || course.className.toLowerCase().includes(keyword.toLowerCase())){
          return true;
          
        }
      }
      return false;
    })

    
  }
    allChecked = false;
    indeterminate = true;
    checkOptionsOne = [
    { label: 'catalog_nbr', value: 'catalog_nbr', checked: false },
    { label: 'subject', value: 'subject', checked: false },
    { label: 'className', value: 'className', checked: false },


   

    ];

    updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne = this.checkOptionsOne.map(item => {
        return {
          ...item,
          checked: true
        };
      });
    } else {
      this.checkOptionsOne = this.checkOptionsOne.map(item => {
        return {
          ...item,
          checked: false
        };
      });
    }
    this.get_courses();


  }

   updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
    console.log(this.checkOptionsOne)
    this.get_courses();
  }

  get_courses(){
    var keyword_list = this.search_keywords.trim().split(' ');
    if(this.search_keywords.trim().length<4){
      this.notification.create("warning","At least 4 characters","please input keywords again");
      return;
    }
    this.course_list_show = this.course_list_original.filter(course=>{
      for(let keyword of keyword_list){
        if(course.catalog_nbr.toLowerCase().includes(this.checkOptionsOne.findIndex(check=>check.checked && check.value=="catalog_nbr")!=-1?keyword.toLowerCase():'') &&
        course.subject.toLowerCase().includes(this.checkOptionsOne.findIndex(check=>check.checked && check.value=="subject")!=-1?keyword.toLowerCase():'') && 
        course.className.toLowerCase().includes(this.checkOptionsOne.findIndex(check=>check.checked && check.value=="className")!=-1?keyword.toLowerCase():'') 
        ){
          return true;
        }
      }
      return false;
    })
  }

  hidden_Review(review,course_id,state){
    
    this.$http.get(`http://127.0.0.1:3000/hide_review?review_id=${review._id}&course_id=${course_id}&state=${state}`).subscribe((resp)=>{
      if(resp["code"]==0){
        this.notification.create("success","Change Review State Successfully","good！");
        review.hidden = state;
      }

      else{
        this.notification.create("error","Error",resp["message"]);

      }
      
        
    });
  }

   dateFormat(msg){
    var date = new Date(msg)
    var year = date.getFullYear()
    var month= (date.getMonth()+1).toString().padStart(2,'0')//padStart()是ES6的新方法，即设置字符串的长度，不足的用第二个参数补充
    var day = (date.getDate()).toString().padStart(2,'0')
    var hour =date.getHours()
    var min = (date.getMinutes()).toString().padStart(2,'0')
    var second = (date.getSeconds()).toString().padStart(2,'0')
    return `${year}-${month}-${day}  ${hour}:${min}:${second}`//这个不是单引号，而是tab键上面的键
  }
  

}
