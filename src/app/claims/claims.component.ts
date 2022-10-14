import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { APPConstants } from '../appCommon/APPConstants';
import { LoginService } from '../login/login.service';
import { DependentModel } from '../models/dependent.model';
import { MemberModel } from '../models/member.model';
import { UserModel } from '../models/user.model';
import { ClaimsService } from './claims.service';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsComponent implements OnInit {

  public claimsForm: FormGroup;
  public showDependentDetails: boolean = false;
  public dependents: DependentModel[] = [];
  public member: MemberModel = new MemberModel();
  public user: UserModel = new UserModel();

  constructor(private claimsService: ClaimsService, private loginService: LoginService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.setClaimsForm();
    this.loginService.user.subscribe(userDetails => {
      this.user = userDetails;
      if(typeof(this.user.dependentList) == 'undefined' || this.user.dependentList == null || this.user.dependentList.dependents == null || this.user.dependentList.dependents.length === 0){
        this.showDependentDetails = false;
      }
      else{
        this.showDependentDetails = true;
        this.dependents = this.user.dependentList.dependents;
      }
    });
  }

  public setClaimsForm(){
    this.claimsForm = new FormGroup({
      memberID: new FormControl(null, [Validators.required, Validators.pattern(APPConstants.memberIDReg)]),
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      dob: new FormControl(null)
    });
  }

  onGetDependents(){
    this.dependents = [];
    let memberID = this.claimsForm.get('memberID').value;
    this.claimsService.getDependenttDetails(memberID).subscribe( response=> {
      this.showDependentDetails = true;
      response[0].dependents.forEach(dependent => {
        this.dependents.push(dependent);
      });
      this.member = response[0].member;
    });
  }

}
