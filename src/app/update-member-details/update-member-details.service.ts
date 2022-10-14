import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UpdateMemberDetailsService {

  ROOT_URL: string = "http://insurance.ap-south-1.elasticbeanstalk.com";

  constructor(private httpClient: HttpClient) { }

  public getMemberDependentDetails(memberID): Observable<UserModel>{
    const url ="../../assets/user.json";
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.append('memberID', memberID);
    return this.httpClient.get<UserModel>(url, { params: httpParams });
  }

  public postUpdateUserDetails(userDetails): Observable<UserModel>{
    const url = this.ROOT_URL+"/updateUser";
    return this.httpClient.patch<UserModel>(url, userDetails);
  }


}
