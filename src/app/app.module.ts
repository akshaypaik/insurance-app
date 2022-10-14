import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ClaimsComponent } from './claims/claims.component';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DatePipe} from '@angular/common';
import { LoginService } from './login/login.service';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './appCommon/auth-guard.service';
import { ClaimsSubmitComponent } from './claims/claims-submit/claims-submit.component';
import { HttpClientModule } from '@angular/common/http';
import { UpdateMemberDetailsComponent } from './update-member-details/update-member-details.component';
import { AddDependentsComponent } from './add-dependents/add-dependents.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'claims', component: ClaimsComponent },
  { path: 'claims-submit', component: ClaimsSubmitComponent },
  { path: 'add-dependents', component: AddDependentsComponent },
  { path: 'update-member', component: UpdateMemberDetailsComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    ClaimsComponent,
    MemberEditComponent,
    HomeComponent,
    ClaimsSubmitComponent,
    UpdateMemberDetailsComponent,
    AddDependentsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [DatePipe, LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
