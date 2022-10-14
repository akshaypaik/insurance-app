import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login/login.service';
import { DependentModel } from '../models/dependent.model';
import { AddDependentsService } from './add-dependents.service';

@Component({
  selector: 'app-add-dependents',
  templateUrl: './add-dependents.component.html',
  styleUrls: ['./add-dependents.component.css']
})
export class AddDependentsComponent implements OnInit {

  public dependentsForm: FormGroup;
  public message: string = '';

  constructor(private datePipe: DatePipe, private addDependentService: AddDependentsService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.setDependentsForm();
  }

  public setDependentsForm(){
    this.dependentsForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      dob: new FormControl(null, Validators.required, this.checkDOB.bind(this))
    });
  }

  checkDOB(){
    const promise = new Promise((resolve)=>{
      let today = new Date;
      let todayDate = this.datePipe.transform(today,"yyyy-MM-dd")
      let userDate = this.dependentsForm.get('dob').value;
      if(userDate > todayDate){
        this.dependentsForm.get('dob').setErrors({'dateInvalid': true});
      }else{
         resolve(null);
      }
    });
    return promise;
  }

  onAddDependent(){
    let dependent: DependentModel  = new DependentModel();
    let memebrID;
    let email;
    dependent.firstName = this.dependentsForm.get('firstName').value;
    dependent.lastName = this.dependentsForm.get('lastName').value;
    dependent.dateOfBirth = this.dependentsForm.get('dob').value;
    
    this.loginService.user.subscribe(user => {
      memebrID = user.memberID;
      email = user.email;
    });

    if(dependent != null){
      this.addDependentService.postAddDependent(dependent, memebrID, email).subscribe(response => {
        if(response != null){
          if(response.msgModel != null && response.msgModel.statusCode === '0'){
            this.loginService.user.next(response);
            this.message = "Dependent Successfully added!!";
          }else{
            this.message = "Exception occurred! Please try later!"
          }
        }
      });
    }
    
  }

}
