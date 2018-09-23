import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class PreventLogged implements CanActivate {

  constructor(private authenticationService: AuthenticationService) {}

  canActivate() {
    return !this.authenticationService.isLoggedIn();
  }
} 
