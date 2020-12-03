import { Component, Input, OnInit } from '@angular/core';
import { interval, Observable, Observer } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';


@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  
  
  own = false;

  
  courseLists=[];

  @Input()
  courseLists_load;

  
  userInfo={
    username:"",
    _id:""
  }

  
  courses=[];

  
  course_list_load;

  courseLists_show = []

  cur_modal_type=""

  CourseList_loading = false;
  CourseList_visible = false;



  ngOnInit(): void {
    


    //获取courses 和 courseLists
    this.$http.get("http://127.0.0.1:3000/get_courses").subscribe((resp)=>{
            this.courses = resp["course_list"];
            this.listOfOption = this.courses.map(course=>{
              return {
                value:course._id,
                label:course.className
              }
            })
            this.course_list_load = true;
      });
    this.$http.get(`http://127.0.0.1:3000/get_courseList?token=${token}`).subscribe((resp)=>{
            this.courseLists = resp["courseLists"];
            for(var course of this.courseLists){
              course.expand=false;
            }
            this.courseLists_show = this.courseLists;
            this.courseLists_load = true;
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
  

  change_own(state){
    this.own = state;
    if(state)
      this.courseLists_show = this.courseLists.filter((courseList)=> courseList.self);
    else
      this.courseLists_show = this.courseLists;
  }


  deleteCourseList(courseList_id){
    this.$http.get(`http://127.0.0.1:3000/delete_courseList?courseList_id=${courseList_id}&token=${localStorage.getItem("token")}`).subscribe((resp) => {
      if(resp["code"]=="0"){
        this.notification.create("success","Delete Successfully","er...... do you remember what have changed(((φ(◎ロ◎;)φ)))");

        var index = this.courseLists.findIndex(courseList=>courseList._id == courseList_id);
        console.log(index);
        this.courseLists.splice(index,1);
        this.courseLists_show = [];
        setTimeout(() => {
          this.courseLists_show = this.courseLists;
        }, 100);
        
      }
      else{
        this.notification.create("error","Error",resp["message"]);

      }
    })
  }
  
  //edit courselist的modal

  validateForm: FormGroup;
  cur_editCourseList = null;

  open_editCourseListModal(courseList){
    this.cur_modal_type = "edit";
    this.cur_editCourseList = courseList;
    this.validateForm.setValue({
      Name:this.cur_editCourseList.name,
      visibility:this.cur_editCourseList.visibility=="public",
      courses:this.cur_editCourseList.course_list.map(course=>course._id),
      descr: this.cur_editCourseList.descr
    });
    this.CourseList_visible = true;
  }
  open_addCourseListModal(){
    this.validateForm.reset();
    
    this.cur_modal_type = "add";
    this.CourseList_visible = true;

  }


  resetFormData(){
    this.validateForm.setValue({
      Name:"",
      visibility:false,
      courses:[],
      descr: ""
    });
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  saveCourseList(){

    if(!this.validateForm.valid){
      return ;
    }
    
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    this.CourseList_loading = true;



    if(this.cur_modal_type=="edit"){
      var edit_courseList = this.submitForm(this.validateForm.value);

      this.$http.post("http://127.0.0.1:3000/edit_course_list",edit_courseList,httpOptions).subscribe((resp)=>{
        if(resp["code"]=="0"){
          this.CourseList_loading = false;
          this.CourseList_visible = false;
          this.notification.create("success","Edit Successfully","er...... do you remember what have changed(((φ(◎ロ◎;)φ)))");
          

        }
        else{
          this.notification.create("error","Error",resp["message"]);
        }
        
      });
    }
    else if(this.cur_modal_type=="add"){
      var add_courseList = this.submitForm(this.validateForm.value);
      this.$http.post("http://127.0.0.1:3000/add_course_list",add_courseList,httpOptions).subscribe((resp)=>{
        if(resp["code"]=="0"){
          this.CourseList_loading = false;
          this.CourseList_visible = false;
          this.notification.create("success","Add Successfully","er...... do you remember what have changed(((φ(◎ロ◎;)φ)))");
        }
        else{
          this.notification.create("error","Error",resp["message"]);
        }
      });
    }
    this.resetFormData();
    this.$http.get(`http://127.0.0.1:3000/get_courseList?token=${localStorage.getItem("token")}`).subscribe((resp) => {
      this.courseLists = resp["courseLists"];
      for (var course of this.courseLists) {
        course.expand = false;
      }
      this.change_own(this.own);
    })

    
    
  }

  submitForm(value) {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();

    }
    console.log(value);
    //对数据进行处理
    var format_courseList = {};
    if(this.cur_modal_type=="edit")
      format_courseList["id"] = this.cur_editCourseList._id;
    if(this.cur_modal_type=="add"){
      format_courseList["creator"]={id:this.userInfo._id,name:this.userInfo.username}
    }
    format_courseList["name"] = value.Name;
    format_courseList["descr"] = value.descr;
    format_courseList["visibility"] = value.visibility?'public':"private";
    format_courseList["course_IDs"] = value.courses;
    format_courseList["pairs"] = [];
    for (let course_id of value.courses){
      let course = this.courses.find(course=>course._id == course_id);
      format_courseList["pairs"].push({subject:course.subject,catalog_nbr:course.catalog_nbr});
    }
    console.log(format_courseList);
    return format_courseList;

  }

  resetForm(e: MouseEvent): void {
    
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  

  NameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      this.$http.get(`http://127.0.0.1:3000/course_list_name_duplicated?name=${control.value}&courseList_id=${this.cur_modal_type=="edit"? this.cur_editCourseList._id:""}`).subscribe((resp)=>{
          if(resp["duplicated"]){
            observer.next({ error: true, duplicated: true });
          }
          else{
            observer.next(null);
          }
          observer.complete();

      });
    });




  constructor(private fb: FormBuilder,private $http:HttpClient,private notification:NzNotificationService) {
    this.validateForm = this.fb.group({
      Name: [ '', [Validators.required], [this.NameAsyncValidator]],
      visibility: [false],
      courses: [ []],
      
      descr: [ '', [Validators.required]]
    });
  }
  

  listOfOption = [];
  
  //关于添加Review的代码
  current_Review="";
  current_Review_CourseList_id;
  addReview_visible = false;
  addReview_loading = false;

  saveReview(){
    this.addReview_loading = true;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    this.$http.post("http://127.0.0.1:3000/add_review",{review:this.current_Review,course_id:this.current_Review_CourseList_id,authorization:localStorage.getItem("token")},httpOptions).subscribe((resp)=>{
      if(resp["code"]==0){
        this.notification.create("success","Add Review Successfully","good！");
      }

      else{
        this.notification.create("error","Error",resp["message"]);

      }
      this.addReview_visible = false;
      this.addReview_loading = false;
        
    });
    
  }




}

