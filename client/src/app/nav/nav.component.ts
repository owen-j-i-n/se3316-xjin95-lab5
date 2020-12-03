import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  cur_anchor = "home";
  
  @Input() user;
  constructor() { }

  ngOnInit(): void {
    
  }
  change_anchor(anchor){
    console.log(this.cur_anchor)
    this.cur_anchor = anchor;
  }
  signout(){
    localStorage.removeItem("token");
    location.reload();
  }

}
