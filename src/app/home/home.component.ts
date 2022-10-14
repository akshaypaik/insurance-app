import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public loggedIn: boolean = false;

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
    this.loggedIn = this.loginService.getLoggedIn();
    if(this.loggedIn){
      this.router.navigate(['/claims']);
    }
    else{
      this.router.navigate(['/login']);
    }
  }

}
