import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APPConstants } from '../appCommon/APPConstants';
import { HeaderComponent } from '../header/header.component';
import { UserModel } from '../models/user.model';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public loginPage: boolean = true;
  public message: string = '';
  public loggedIn: boolean = false;

  constructor(private datePipe: DatePipe, private loginService: LoginService, private router: Router, private header: HeaderComponent) { }

  ngOnInit(): void {
    this.setLoginForm();
    this.setRegisterForm();
  }

  public setLoginForm(){
    this.loginForm = new FormGroup({
       email: new FormControl(null, [Validators.pattern(APPConstants.emailReg), Validators.required]),
       password: new FormControl(null, [Validators.pattern(APPConstants.passwordReg), Validators.required])
      //email: new FormControl(null, Validators.required),
      //password: new FormControl(null, Validators.required)
    });
  }

  public setRegisterForm(){
    this.registerForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      dob: new FormControl(null, [Validators.required], this.checkDOB.bind(this)),
      phoneNumber: new FormControl(null, [Validators.required, Validators.pattern(APPConstants.phoneReg)]),
      pan: new FormControl(null, [Validators.required, Validators.pattern(APPConstants.panReg)]),
      address: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.pattern(APPConstants.emailReg), Validators.required]),
      password: new FormControl(null, [Validators.pattern(APPConstants.passwordReg), Validators.required]),
      confirmPassword: new FormControl(null, [Validators.pattern(APPConstants.passwordReg), Validators.required], this.checkConfirmPassword.bind(this))
    });
  }

  onLoginSubmit(){
    let username = this.loginForm.get('email').value;
    let password = this.loginForm.get('password').value;
    this.loginService.getLoginDetails(username, password).subscribe(response=>{
      console.log(response);
      if(response != null){
        if(typeof(response.msgModel) != 'undefined' && response.msgModel != null && response.msgModel.statusCode === '0'){
          this.loggedIn = true;
          this.header.onLogin();
        }else {
          this.message = "Invalid Credentials";
        }
      }else {
        this.message = "Invalid Credentials";
      }
    });
    //let loggedIn = this.loginService.getLoggedIn();
    // if(loggedIn){
    //   this.message = "Logged In";
    //   this.loggedIn = true;
    //   this.header.onLogin();
    // } else {
    //   this.message = "Invalid Credentials";
    // }
  }

  onRegister(){
    this.loginPage = false;
    this.loginForm.reset();
  }

  onRegisterSubmit(){
    let user = new UserModel();
    user.firstName = this.registerForm.get('firstName').value;
    user.lastName = this.registerForm.get('lastName').value;
    user.email = this.registerForm.get('email').value;
    user.address = this.registerForm.get('address').value;
    user.dateOfBirth = this.registerForm.get('dob').value;
    user.panNumber = this.registerForm.get('pan').value;
    user.password = this.registerForm.get('password').value;
    user.phoneNumber = this.registerForm.get('phoneNumber').value;

    this.loginService.postUserDetailsOnRegister(user).subscribe(response => {
      if(response != null){
        if(typeof(response.msgModel) != 'undefined' && response.msgModel != null && response.msgModel.statusCode === '0'){
          this.message = 'Successfully Registered! Member id is : ' + response.memberID;
        }else{
          this.message = 'Failed to registered due to Exception. Please try again later!';
        }
      }
    });

  }

  backToLogin(){
    this.message = '';
    this.loginPage = true;
    this.registerForm.reset();
  }

  checkDOB(){
    const promise = new Promise((resolve)=>{
      let today = new Date;
      let todayDate = this.datePipe.transform(today,"yyyy-MM-dd")
      let userDate = this.registerForm.get('dob').value;
      if(userDate > todayDate){
        this.registerForm.get('dob').setErrors({'dateInvalid': true});
      }else{
          var birthDate = new Date(userDate);
          var age = today.getFullYear() - birthDate.getFullYear();
          var m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
          {
              age--;
          }
          if(age < 18){
            this.registerForm.get('dob').setErrors({'ageLimit': true});
          }else{
            resolve(null);
          }
      }
    });
    return promise;
  }

  checkConfirmPassword(){
    const promise = new Promise((resolve)=>{
      const password = this.registerForm.get('password').value;
      const confirmPassword = this.registerForm.get('confirmPassword').value;
      if(password === confirmPassword){
        resolve(null);
      }else{
        this.registerForm.get('confirmPassword').setErrors({'notSame': true});
      }
    });
    return promise;
  }

}