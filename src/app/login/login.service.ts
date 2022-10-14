import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loggedIn: boolean = false;
  public username: string = '';
  public password: string = '';
  public user = new BehaviorSubject<UserModel>(null);

  ROOT_URL: string = "http://insurance.ap-south-1.elasticbeanstalk.com";

  constructor(private httpClient: HttpClient) { }

  public postUserDetailsOnRegister(user: UserModel): Observable<UserModel>{
    let url = this.ROOT_URL+"/registerUser";
    return this.httpClient.post<UserModel>(url, user);
  }

  public getLoginDetails(username, password): Observable<UserModel>{

    const url = this.ROOT_URL+"/loginUser";
    //const url ="../../assets/user.json";
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.append('username', username);
    httpParams = httpParams.append('password', password);
    return this.httpClient.get<UserModel>(url, { params: httpParams }).pipe(
      catchError(this.handleError),
      tap(resData=> {
        if(resData.msgModel != null && resData.msgModel.statusCode === '0'){
          this.handleAuthentication(resData);
        }
    }));
  }

  public handleError(errorMessage: HttpErrorResponse){
    let errorMsg = 'An unknown error occured !!';
    if(!errorMessage.error || !errorMessage.error.error){
      return throwError(errorMsg);
    }
    return throwError(errorMessage);
  }

  public handleAuthentication(resData: UserModel){
    const user = new UserModel();
      user.email = resData.email;
      //user._token = resData.token;
      user.msgModel = resData.msgModel;
      user.memberID = resData.memberID;
      user.password = resData.password;
      user.address = resData.address;
      user.dateOfBirth = resData.dateOfBirth;
      user.firstName = resData.firstName;
      user.lastName = resData.lastName;
      user.email = resData.email;
      user.panNumber = resData.panNumber;
      user.phoneNumber = resData.phoneNumber;
      user.dependentList = resData.dependentList;
      user.claimsList = resData.claimsList;
      this.user.next(user);
  }

  public isAuthenticated(){
    // const promise = new Promise((resolve, reject) => {
    //   resolve(this.loggedIn);
    // })
    // return promise;
  }

  public getUsername(){
    return this.username;
  }

  public setUsername(username){
    this.username = username;
  }

  public getPassword(){
    return this.password;
  }

  public setPassword(password){
    this.password = password;
  }

  public getLoggedIn(){
    return this.loggedIn;
  }

  public setLoggedIn(loggedIn){
   this.loggedIn = loggedIn;
  }

}
