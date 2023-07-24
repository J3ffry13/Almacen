import {Injectable} from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router
} from '@angular/router';
import {Observable} from 'rxjs';
import { LoginService } from '@services/auth/login.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private loginService: LoginService) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
          if (this.loginService.getToken() == null){
            this.router.navigate(['/login']);
          }
    
          return true;
      }

    // canActivate(
    //     next: ActivatedRouteSnapshot,
    //     state: RouterStateSnapshot
    // ):
    //     | Observable<boolean | UrlTree>
    //     | Promise<boolean | UrlTree>
    //     | boolean
    //     | UrlTree {
    //     return this.getProfile();
    // } 

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.canActivate(next, state);
    }

    // async getProfile() {
    //     if (this.appService.user) {
    //         return true;
    //     }

    //     try {
    //         await this.appService.getProfile();
    //         return true;
    //     } catch (error) {
    //         return false;
    //     }
    // }
}
