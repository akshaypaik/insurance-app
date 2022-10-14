import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { APPConstants } from '../appCommon/APPConstants';
import { LoginService } from '../login/login.service';
import { DependentModel } from '../models/dependent.model';
import { DependentListModel } from '../models/dependentList.model';
import { UserModel } from '../models/user.model';
import { UpdateMemberDetailsService } from './update-member-details.service';

@Component({
  selector: 'app-update-member-details',
  templateUrl: './update-member-details.component.html',
  styleUrls: ['./update-member-details.component.css']
})
export class UpdateMemberDetailsComponent implements OnInit {

  public claimsForm: FormGroup;
  public updateDetails: FormGroup
  public showEditScreen: boolean = false;
  public dependents: DependentModel[] = [];
  public dependentsFormCon = new FormArray([]);
  public user: UserModel = new UserModel();
  public message: string = '';

  constructor(private updateService: UpdateMemberDetailsService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.setClaimsForm();
    this.setUpdateDetailsForm();
    this.onGetDependents();
  }

  public setClaimsForm(){
    this.claimsForm = new FormGroup({
      memberID: new FormControl(null, [Validators.required, Validators.pattern(APPConstants.memberIDReg)]),
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      dob: new FormControl(null)
    });
  }

  public setUpdateDetailsForm(){
    this.dependentsFormCon = new FormArray([]);
    this.updateDetails = new FormGroup({
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      dob: new FormControl(null),
      email: new FormControl(null, [Validators.pattern(APPConstants.emailReg), Validators.required]),
      pan: new FormControl(null, [Validators.required, Validators.pattern(APPConstants.panReg)]),
      phoneNumber: new FormControl(null, [Validators.required, Validators.pattern(APPConstants.phoneReg)]),
      address: new FormControl(null, [Validators.required]),
      dependentsCtrl: this.dependentsFormCon
    });
  }

  onGetDependents(){
    this.loginService.user.subscribe(response=> {
      if(response != null){
        this.showEditScreen = true;
        this.user = response;
      }
    });
    if(typeof(this.user.dependentList) != 'undefined' && this.user.dependentList != null){
      this.user.dependentList.dependents.forEach(dep => {
        let dob = this.formatDate(dep.dateOfBirth);
        this.dependents.push(dep);
        this.dependentsFormCon.push(
          new FormGroup({
            'dependentFirstName': new FormControl({value: dep.firstName, disabled: true}),
            'dependentLastName': new FormControl({value: dep.lastName, disabled: true}),
            'dependentDOB': new FormControl(dob)
          })
        );
      });
    }
    this.patchUpdateForm(this.user);
    this.disableNonEditFields();
  }

  patchUpdateForm(responseData: UserModel){
    this.updateDetails.controls['firstName'].patchValue(responseData.firstName);
    this.updateDetails.controls['lastName'].patchValue(responseData.lastName);
    let dob = this.formatDate(responseData.dateOfBirth);
    this.updateDetails.controls['dob'].patchValue(dob);
    this.updateDetails.controls['email'].patchValue(responseData.email);
    this.updateDetails.controls['pan'].patchValue(responseData.panNumber);
    this.updateDetails.controls['phoneNumber'].patchValue(responseData.phoneNumber);
    this.updateDetails.controls['address'].patchValue(responseData.address);
  }

  disableNonEditFields(){
    this.updateDetails.controls['firstName'].disable();
    this.updateDetails.controls['lastName'].disable();
    this.updateDetails.controls['dob'].disable();
    
  }

  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  onSave(){
    let userDetails: UserModel = new UserModel();
    let dependentsList: DependentListModel = new DependentListModel();
    let dependents: DependentModel[] = [];
    userDetails.memberID = this.user.memberID;
    userDetails.password = this.user.password;
    userDetails.claimsList = this.user.claimsList;
    userDetails.firstName = this.updateDetails.get('firstName').value;
    userDetails.lastName = this.updateDetails.get('lastName').value;
    userDetails.dateOfBirth = this.updateDetails.get('dob').value;
    userDetails.email = this.updateDetails.get('email').value;
    userDetails.panNumber = this.updateDetails.get('pan').value;
    userDetails.phoneNumber = this.updateDetails.get('phoneNumber').value;
    userDetails.address = this.updateDetails.get('address').value;
    for(let i = 0 ; i < this.dependentsFormCon.length; i++){
      let dependent: DependentModel = new DependentModel();
      for(let j = 0 ; j < this.user.dependentList.dependents.length; j++){
        if( i === j){
          dependent.dependentID = this.user.dependentList.dependents[j].dependentID;
          dependent.memberID = this.user.dependentList.dependents[j].memberID;
          dependent.firstName = this.dependentsFormCon['controls'][i].get('dependentFirstName').value;
          dependent.lastName = this.dependentsFormCon['controls'][i].get('dependentLastName').value;
          dependent.dateOfBirth = this.dependentsFormCon['controls'][i].get('dependentDOB').value;
          dependents.push(dependent);
        }
      }
    }
    dependentsList.dependents = dependents;
    userDetails.dependentList = dependentsList;
    // this.dependentsFormCon.controls.forEach(dep => {
    //   let dependent: DependentModel = new DependentModel();
    //   this.user.dependentList.dependents.forEach(dep1 => {
    //     dependent.dependentID = dep1.dependentID;
    //     dependent.memberID = dep1.memberID;
    //     dependent.firstName = dep.get('dependentFirstName').value;
    //     dependent.lastName = dep.get('dependentLastName').value;
    //     dependent.dateOfBirth = dep.get('dependentDOB').value;
    //     dependents.push(dependent);
    //   });
    // });
    this.updateService.postUpdateUserDetails(userDetails).subscribe(response=> {
      if(response != null){
        if(response.msgModel != null && response.msgModel.statusCode === '0'){
          this.message = 'Successfully Saved!';
          this.loginService.user.next(response);
        }else{
          this.message = 'Failed to save due to Exception. Please try again later!';
        }
      }
    });
  }

}
