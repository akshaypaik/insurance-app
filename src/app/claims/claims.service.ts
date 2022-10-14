import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DependentModel } from '../models/dependent.model';
import { DependentListModel } from '../models/dependentList.model';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {

  ROOT_URL: string = "http://insurance.ap-south-1.elasticbeanstalk.com";

  constructor(private httpClient: HttpClient) { }

  public getDependenttDetails(memberID): Observable<DependentListModel>{
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.append('memberID', memberID);
    return this.httpClient.get<DependentListModel>("../../assets/dependentjson.json", { params: httpParams });
  }

  public postClaimsDetails(claimDetails, memberID: number, email: string): Observable<UserModel>{
    const url = this.ROOT_URL+"/submitClaims";
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.append("memberID", memberID);
    httpParams = httpParams.append("email", email);
    return this.httpClient.post<UserModel>(url, claimDetails, { params: httpParams });
  }

  public formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

}
