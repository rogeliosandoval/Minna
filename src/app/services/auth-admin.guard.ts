import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthAdminGuard implements CanActivate {

  constructor(private router: Router, private fireAuth: AngularFireAuth){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise((resolve, reject) => {
      this.fireAuth.onAuthStateChanged((user) => {
        if (user && user?.email === 'rojaa1996@yahoo.com') {
          resolve(true);
        } else {
          console.log('Auth Guard: you are not an admin');
          this.router.navigate(['/home']); // a logged out user will always be sent to home
          resolve(false);
        }
      });
    });
  }
  
}
