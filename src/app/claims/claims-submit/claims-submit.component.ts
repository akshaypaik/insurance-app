import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { APPConstants } from 'src/app/appCommon/APPConstants';
import { LoginService } from 'src/app/login/login.service';
import { ClaimsModel } from 'src/app/models/calims.model';
import { UserModel } from 'src/app/models/user.model';
import { ClaimsService } from '../claims.service';

@Component({
  selector: 'app-claims-submit',
  templateUrl: './claims-submit.component.html',
  styleUrls: ['./claims-submit.component.css']
})
export class ClaimsSubmitComponent implements OnInit {

  public claimsForm: FormGroup;
  public message: string = '';
  private user: UserModel;
  public showClaims: boolean = true;
  public claimsID: number;
  public cliamsDetails: ClaimsModel;

  constructor(private datePipe: DatePipe, private loginService: LoginService, private claimsService: ClaimsService) { }

  ngOnInit(): void {
    this.setClaimsForm();
    this.loginService.user.subscribe(response=> {
      this.claimsForm.get('memberID').patchValue(response.memberID);
      this.user = response;
    });
    if(typeof(this.user) != 'undefined' && this.user != null && typeof(this.user.claimsList) != 'undefined' && this.user.claimsList != null 
      && this.user.claimsList.claims.length > 0){
      this.showClaims = false;
      this.user.claimsList.claims.forEach(claimsDetails=> {
        this.cliamsDetails = claimsDetails;
      });
    }
  }

  public setClaimsForm(){
    this.claimsForm = new FormGroup({
      memberID: new FormControl({ value: null, disabled: true}, [Validators.required, Validators.pattern(APPConstants.memberIDReg)]),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      dob: new FormControl(null, [Validators.required], this.checkDOB.bind(this)),
      dateOfAdmission: new FormControl(null),
      dateOfDischarge: new FormControl(null, [Validators.required], this.checkDateOfDischarge.bind(this)),
      providerName: new FormControl(null, Validators.required),
      totalBillAmount: new FormControl(null, Validators.required)
    });
  }

  checkDOB(){
    const promise = new Promise((resolve)=>{
      const today = new Date;
      const todayDate = this.datePipe.transform(today,"yyyy-MM-dd")
      const userDate = this.claimsForm.get('dob').value;
      if(userDate > todayDate){
        this.claimsForm.get('dob').setErrors({'dateInvalid': true});
      }else{
        this.claimsForm.controls['dob'].valid;
        this.claimsForm.get('dob').setErrors(null);
        resolve(null);
      }
    });
    return promise;
  }

  checkDateOfDischarge(){
    const promise = new Promise((resolve)=>{
      const dateOfAdmission = this.claimsForm.get('dateOfAdmission').value;
      const dateOfDischarge = this.claimsForm.get('dateOfDischarge').value;
      if(dateOfAdmission > dateOfDischarge){
        this.claimsForm.get('dateOfDischarge').setErrors({'dateDischargeInvalid': true});
      }else{
        this.claimsForm.get('dateOfDischarge').setErrors(null);
        resolve(null);
      }
    });
    return promise;
  }

  onClaimsSubmit(){
    let claimDetails: ClaimsModel = new ClaimsModel();
    let memebrID;
    let email;

    this.loginService.user.subscribe(user => {
      memebrID = user.memberID;
      email = user.email;
    });

    claimDetails.memberID = memebrID;
    claimDetails.firstName = this.claimsForm.get('firstName').value;
    claimDetails.lastName = this.claimsForm.get('lastName').value;
    claimDetails.dateOfBirth = this.claimsForm.get('dob').value;
    claimDetails.dateOfAdmission = this.claimsForm.get('dateOfAdmission').value;
    claimDetails.dateOfDischarge = this.claimsForm.get('dateOfDischarge').value;
    claimDetails.providerName = this.claimsForm.get('providerName').value;
    claimDetails.totalBillAmount = this.claimsForm.get('totalBillAmount').value;

    this.claimsService.postClaimsDetails(claimDetails, memebrID, email).subscribe(response => {
      if(response != null){
        if(response.msgModel != null && response.msgModel.statusCode === '0'){
          this.loginService.user.next(response);
          response.claimsList.claims.forEach(claimsResponse => {
            this.message = "Claims Submitted Successfully!! Claims Number: " + claimsResponse.claimsID;
            //this.afterClaimSubmit();
          });
        }else{
          this.message = "Exception occurred! Please try later!"
        }
      }
    });

  }

  public afterClaimSubmit(){
    setTimeout(() => {
      this.showClaims = false;
    }, 5000);
  }

}
