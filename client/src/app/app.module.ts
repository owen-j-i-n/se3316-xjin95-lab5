import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { IndexComponent } from './index/index.component';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import { BrowserAnimationsModule  } from '@angular/platform-browser/animations'
import { NzIconModule  } from 'ng-zorro-antd/icon'
import { from } from 'rxjs';
import { LoginComponent } from './login/login.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { RegisterComponent } from './register/register.component';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzAnchorModule,NzAnchorComponent } from 'ng-zorro-antd/anchor';
import { CoursesComponent } from './courses/courses.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { CourseListComponent } from './course-list/course-list.component';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NavComponent } from './nav/nav.component';
import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    
    LoginComponent,
    RegisterComponent,
    CoursesComponent,
    CourseListComponent,
    NavComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzButtonModule,
    NzMenuModule,
    NzGridModule,
    NzIconModule,
    BrowserAnimationsModule,
    NzFormModule,
    NzInputModule,
    NzNotificationModule,
    NzAnchorModule,
    NzTableModule,
    NzCheckboxModule,
    NzListModule,
    NzPopconfirmModule,
    NzModalModule,
    NzSelectModule,
    NzSwitchModule,
    NzTagModule
  ],
  providers: [NzAnchorComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
