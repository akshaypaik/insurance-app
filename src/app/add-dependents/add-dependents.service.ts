import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DependentModel } from '../models/dependent.model';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AddDependentsService {

  ROOT_URL: string = "http://insurance.ap-south-1.elasticbeanstalk.com";

  constructor(private httpClient: HttpClient) { }

  public postAddDependent(dependent: DependentModel, memberID: number, email: string): Observable<UserModel>{
    let url = this.ROOT_URL+"/addDependent";
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.append("memberID", memberID);
    httpParams = httpParams.append("email", email);
    return this.httpClient.post<UserModel>(url, dependent, { params: httpParams });
  }

}
