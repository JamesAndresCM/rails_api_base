import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private router: Router, private userService: UserService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        let id = JSON.parse(localStorage.getItem('currentUser'));
        if(id){
          id = JSON.parse(localStorage.getItem('currentUser')).user_id;
        }
        let url = state;
        return this.checkAdmin(id, url);
    }
    public checkService:boolean;
    checkAdmin(id: number,url): Observable<boolean> {
        return this.userService.getById(id).map(res=>{
          if(res.role == "admin"){
            return true;
          }else{
            this.router.navigate(['/login'], { queryParams: { returnUrl: url.url }});
            return false;
          }
      });
    }
  }

