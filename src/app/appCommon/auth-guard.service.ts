import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //   return this.loginService.isAuthenticated().then((authenticated: boolean) => {
  //     if(authenticated){
  //       return true;
  //     }
  //     else{
  //       this.router.navigate(['/login']);
  //       return false;
  //     }
  //   })
  return null;
   }

}
