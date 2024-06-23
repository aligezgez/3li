import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { dashboardComponent } from './components/dashboard/dashboard.component';
import { MessageComponent } from './components/message/message.component';
import { error } from 'console';
import { ErrorComponent } from './components/error/error.component';
import { NgModule } from '@angular/core';



 const routeConfig: Routes = [
    {path: '', component: HomeComponent},
    {path:'signup',component:SignupComponent},
    {path:'login',component:LoginComponent},
    {path:'profile',component:dashboardComponent},
    {path:'message',component:MessageComponent},
    {path:'dashboard',component:dashboardComponent},
    {path:'error',component:ErrorComponent}

 ];


export default routeConfig; 